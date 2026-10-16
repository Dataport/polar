import { CadastralInput } from './parseInput'

export const namespaces = {
  cp: 'http://inspire.ec.europa.eu/schemas/cp/4.0',
  gn: 'http://inspire.ec.europa.eu/schemas/gn/4.0',
  gmd: 'http://www.isotc211.org/2005/gmd',
}

export const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const equal = (property: string, value: string) =>
  `<fes:PropertyIsEqualTo><fes:ValueReference>${property}</fes:ValueReference><fes:Literal>${escapeXml(
    value
  )}</fes:Literal></fes:PropertyIsEqualTo>`

export const like = (property: string, value: string) =>
  `<fes:PropertyIsLike wildCard="*" singleChar="." escapeChar="!" matchCase="false"><fes:ValueReference>${property}</fes:ValueReference><fes:Literal>${escapeXml(
    value
  )}</fes:Literal></fes:PropertyIsLike>`

export const combine = (operator: 'And' | 'Or', filters: string[]) => {
  if (!filters.length) {
    throw new Error('A cadastral request must contain a filter.')
  }
  return filters.length === 1
    ? filters[0]
    : `<fes:${operator}>${filters.join('')}</fes:${operator}>`
}

export const buildRequest = (
  type: 'CadastralParcel' | 'CadastralZoning',
  filter: string,
  count: number,
  srsName: string
) =>
  `<?xml version="1.0" encoding="UTF-8"?><wfs:GetFeature xmlns:wfs="http://www.opengis.net/wfs/2.0" xmlns:fes="http://www.opengis.net/fes/2.0" xmlns:cp="${
    namespaces.cp
  }" xmlns:gn="${namespaces.gn}" xmlns:gmd="${
    namespaces.gmd
  }" service="WFS" version="2.0.0" count="${count}"><wfs:Query typeNames="cp:${type}" srsName="${escapeXml(
    srsName
  )}"><fes:Filter>${filter}</fes:Filter></wfs:Query></wfs:GetFeature>`

export const resourceIds = (references: string[]) =>
  references
    .map(
      (reference) =>
        `<fes:ResourceId rid="CadastralZoning_${escapeXml(reference)}"/>`
    )
    .join('')

export const districtFilter = (input: CadastralInput) =>
  combine('And', [
    equal('cp:levelName/gmd:LocalisedCharacterString', 'Gemarkung'),
    like(
      'cp:name/gn:GeographicalName/gn:spelling/gn:SpellingOfName/gn:text',
      `${input.gemarkungName}*`
    ),
    ...(input.gemarkungNumber
      ? [
          like(
            'cp:nationalCadastalZoningReference',
            input.gemarkungNumber.length === 4
              ? `..${input.gemarkungNumber}`
              : input.gemarkungNumber
          ),
        ]
      : []),
  ])

export const parcelFilter = (
  input: CadastralInput,
  districtReferences: string[]
) => {
  if (input.kind === 'kennzeichen') {
    return like('cp:nationalCadastralReference', `${input.reference}*`)
  }
  const withDenominator = like('cp:label', `${input.zaehler}/*`)
  const labelFilter = input.nenner
    ? equal('cp:label', `${input.zaehler}/${input.nenner}`)
    : input.nennerOpen
    ? withDenominator
    : combine('Or', [equal('cp:label', input.zaehler ?? ''), withDenominator])
  if (districtReferences.length) {
    return combine('And', [
      combine(
        'Or',
        districtReferences.map((reference) =>
          like(
            'cp:nationalCadastralReference',
            `${reference}${
              input.flur?.padStart(3, '0') ?? '...'
            }${input.zaehler?.padStart(5, '0')}${
              input.nenner?.padStart(4, '0') ?? '*'
            }${input.nenner ? '*' : ''}`
          )
        )
      ),
      labelFilter,
    ])
  }
  return labelFilter
}
