import { Feature, FeatureCollection } from 'geojson'
import { InspireCadastralParameters } from '../types'
import { errorCheck } from '../utils/errorCheck'
import { parseWfsResponse } from '../wfs/parse'
import { parseInput } from './parseInput'
import {
  buildRequest,
  districtFilter,
  escapeXml,
  namespaces,
  parcelFilter,
  resourceIds,
} from './buildRequests'

interface District {
  reference: string
  name: string
}

const districtCaches = new Map<string, Map<string, District>>()
const emptyCollection = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
})

const property = (element: Element, name: string) =>
  element.getElementsByTagNameNS(namespaces.cp, name)[0]?.textContent ?? ''

const zoningDistricts = (document: Document): District[] =>
  Array.from(document.getElementsByTagNameNS(namespaces.cp, 'CadastralZoning'))
    .filter((element) => property(element, 'levelName').trim() === 'Gemarkung')
    .map((element) => {
      const reference = property(element, 'nationalCadastalZoningReference')
      const name =
        element.getElementsByTagNameNS(namespaces.gn, 'text')[0]?.textContent ??
        ''
      if (!/^\d{6}$/.test(reference) || !name) {
        throw new Error('Invalid INSPIRE cadastral district response.')
      }
      return { reference, name }
    })

const ensureNotAborted = (signal: AbortSignal | null) => {
  if (signal?.aborted) {
    throw new DOMException('Cadastral search was aborted.', 'AbortError')
  }
}

const positiveInteger = (value: number, name: string) => {
  if (!Number.isSafeInteger(value) || value < 1) {
    throw new Error(
      `INSPIRE cadastral search: ${name} must be a positive integer.`
    )
  }
  return value
}

/**
 * Searches German INSPIRE CP parcels and zonings and resolves district names.
 * The supplied service must expose CP 4.0 via WFS 2.0.0.
 */
export async function getInspireCadastralParcels(
  signal: AbortSignal | null,
  url: string,
  inputValue: string,
  parameters: InspireCadastralParameters = {}
): Promise<FeatureCollection> {
  const maxFeatures = positiveInteger(
    parameters.maxFeatures ?? 20,
    'maxFeatures'
  )
  const maxGemarkungen = positiveInteger(
    parameters.maxGemarkungen ?? 10,
    'maxGemarkungen'
  )
  const srsName = parameters.srsName ?? 'EPSG:25832'
  const [input] = parseInput(inputValue)
  ensureNotAborted(signal)
  let cache = districtCaches.get(url)
  if (!cache) {
    cache = new Map()
    districtCaches.set(url, cache)
  }

  const request = async (
    type: 'CadastralParcel' | 'CadastralZoning',
    filter: string,
    count: number
  ) => {
    ensureNotAborted(signal)
    const response = await fetch(url, {
      method: 'POST',
      signal,
      headers: [['Content-Type', 'text/xml']],
      body: buildRequest(type, filter, count, srsName),
    })
    errorCheck(response)
    const text = await response.clone().text()
    ensureNotAborted(signal)
    const document = new DOMParser().parseFromString(text, 'application/xml')
    if (document.getElementsByTagName('parsererror').length) {
      throw new Error('Invalid XML in INSPIRE cadastral response.')
    }
    const exceptions = document.getElementsByTagNameNS('*', 'ExceptionText')
    if (exceptions.length) {
      throw new Error(
        `INSPIRE cadastral service: ${Array.from(exceptions)
          .map((element) => element.textContent?.trim())
          .join('; ')}`
      )
    }
    if (document.documentElement.localName !== 'FeatureCollection') {
      throw new Error(
        'Expected a WFS FeatureCollection from cadastral service.'
      )
    }
    const collection = await parseWfsResponse(
      response,
      undefined,
      false,
      '2.0.0',
      'geometry'
    )
    ensureNotAborted(signal)
    return { document, collection }
  }

  let districts: District[] = []
  let collection: FeatureCollection
  if (input.gemarkungName) {
    const result = await request(
      'CadastralZoning',
      districtFilter(input),
      maxGemarkungen
    )
    districts = zoningDistricts(result.document)
    districts.forEach((district) => cache.set(district.reference, district))
    if (!districts.length) {
      return emptyCollection()
    }
    if (input.kind === 'zoning' && !input.flur) {
      collection = result.collection
    } else if (input.kind === 'zoning') {
      collection = (
        await request(
          'CadastralZoning',
          resourceIds(
            districts.map(
              ({ reference }) => `${reference}${input.flur?.padStart(3, '0')}`
            )
          ),
          maxFeatures
        )
      ).collection
    } else {
      collection = (
        await request(
          'CadastralParcel',
          parcelFilter(
            input,
            districts.map(({ reference }) => reference)
          ),
          maxFeatures
        )
      ).collection
    }
  } else {
    collection = (
      await request('CadastralParcel', parcelFilter(input, []), maxFeatures)
    ).collection
  }

  const referenceOf = (feature: Feature): string => {
    const reference =
      feature.properties?.nationalCadastralReference ??
      feature.properties?.nationalCadastalZoningReference
    if (
      typeof reference !== 'string' ||
      !/^(\d{6}|\d{9}|\d{14}[\d_]{4}__)$/.test(reference)
    ) {
      throw new Error('Missing or invalid INSPIRE cadastral reference.')
    }
    return reference
  }
  const missing = [
    ...new Set(
      collection.features
        .map((feature) => referenceOf(feature).substring(0, 6))
        .filter((reference) => !cache.has(reference))
    ),
  ]
  if (missing.length) {
    const result = await request(
      'CadastralZoning',
      resourceIds(missing),
      missing.length
    )
    zoningDistricts(result.document).forEach((district) =>
      cache.set(district.reference, district)
    )
    const unresolved = missing.filter((reference) => !cache.has(reference))
    if (unresolved.length) {
      throw new Error(
        `Cadastral district names could not be resolved: ${unresolved.join(
          ', '
        )}.`
      )
    }
  }

  collection.features = collection.features.map((feature) => {
    const reference = referenceOf(feature)
    const district = cache.get(reference.substring(0, 6))
    if (!district) {
      throw new Error(`Missing cadastral district for ${reference}.`)
    }
    const flur =
      reference.length >= 9 ? String(Number(reference.substring(6, 9))) : ''
    const isParcel = reference.length === 20
    const zaehler = isParcel ? String(Number(reference.substring(9, 14))) : ''
    const denominator = reference.substring(14, 18).replace(/_/g, '')
    const nenner =
      isParcel && denominator && Number(denominator)
        ? String(Number(denominator))
        : ''
    const gemarkungsnummer = reference.substring(2, 6)
    const title = [
      `Gemarkung ${district.name} (${gemarkungsnummer})`,
      ...(flur ? [`Flur ${flur}`] : []),
      ...(isParcel
        ? [`Flurst\u00fcck ${zaehler}${nenner ? `/${nenner}` : ''}`]
        : []),
    ].join(', ')
    return {
      ...feature,
      title: escapeXml(title),
      properties: {
        ...feature.properties,
        gemarkung: district.name,
        gemarkungsnummer,
        flur,
        zaehler,
        nenner,
        ...(isParcel ? { flurstueckskennzeichen: reference } : {}),
      },
    }
  })
  collection.features.sort((a, b) => {
    for (const key of [
      'gemarkung',
      'gemarkungsnummer',
      'flur',
      'zaehler',
      'nenner',
    ]) {
      const comparison = String(a.properties?.[key] ?? '').localeCompare(
        String(b.properties?.[key] ?? ''),
        'de',
        { numeric: true }
      )
      if (comparison) return comparison
    }
    return 0
  })
  collection.features = collection.features.slice(0, maxFeatures)
  ensureNotAborted(signal)
  return collection
}
