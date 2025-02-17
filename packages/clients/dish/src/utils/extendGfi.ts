// non-standard names allowed as keys are used as display text
/* eslint-disable @typescript-eslint/naming-convention */

import { Feature as GeoJsonFeature, GeoJsonProperties, Geometry } from 'geojson'
import {
  EfiBeschreibung,
  DishFeaturePropertiesOnSuccess,
  DishFeatureProperties,
} from '../types'
import { denkmaelerWmService } from '../services'
import { dishBaseUrl, denkmaelerWFS } from '../servicesConstants'

const layerPool = denkmaelerWmService.layers.split(',')
const sachgesamtheitPool = ['9', '10']
let first = true

/**
 * DISH backend is exotic. Its return value is read here.
 * Example return value from https://efi2.schleswig-holstein.de/dish/dish_suche/ergebnisse/text/Volltext1506.txt:
 * ```txt
 * eintrag.Wert->["Geschichtlich","Künstlerisch","Städtebaulich"]
 * eintrag.ObjektID->1506
 * eintrag.objektansprache->Kirche St. Secundus mit Ausstattung
 * eintrag.Kreis->Dithmarschen
 * eintrag.Gemeinde->Hennstedt
 * eintrag.wohnplatz->Hennstedt
 * eintrag.strasse->An der Kirche||
 * eintrag.objektart->Kirche
 * eintrag.objektfunktion->Kirche
 * eintrag.objektplz->25779
 * eintrag.tbldlisteinaKurzBeschreibungen->Alteintragung (Aktualisierung vorgesehen)
 * eintrag.tbldlisteinaBeschreibungen->Alteintragung (Aktualisierung vorgesehen)
 * ```
 * @param beschreibung - as returned by backend
 * @returns read contents
 */
export const parseBeschreibung = (beschreibung: string): EfiBeschreibung =>
  Object.fromEntries(
    beschreibung.split('\n').map((line) => {
      const [k, v] = line.split('->')
      return [k.substring(8), v]
    })
  ) as unknown as EfiBeschreibung

async function parseText(
  response: string,
  identifier: string
): Promise<DishFeaturePropertiesOnSuccess> {
  const obj: Record<string, string> = Object.fromEntries(
    Object.entries(parseBeschreibung(response)).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replaceAll('\r', '') : value,
    ])
  )
  return {
    Bezeichnung: obj.objektansprache || '---',
    Foto: await getPhoto(identifier),
    Kreis: obj.Kreis || '---',
    Gemeinde: obj.Gemeinde || '---',
    PLZ: obj.objektplz || '---',
    Straße: obj.strasse?.replaceAll('||', ' ') || '---',
    Objektnummer: obj.ObjektID,
    Detailinformationen: await getHitInSearch(identifier),
    Export: `${dishBaseUrl}/dish_pdf/dish_pdfgenerate.php?id=${obj.ObjektID}`,
  }
}

async function getText(identifier: string): Promise<DishFeatureProperties> {
  try {
    const response = await fetch(
      `${dishBaseUrl}/dish_suche/ergebnisse/text/Volltext${identifier}.txt`
    )
    if (response.status !== 200) {
      console.error(
        `@polar/client-dish: DISH backend returned status ${response.status}. Response object: `,
        response
      )
      return { Information: 'Keine Informationen zum Denkmal gefunden' }
    }
    const reader = response.body?.getReader?.()
    if (!reader) {
      throw new Error('Response body was null.')
    }
    const { value: chunk } = await reader.read()
    if (chunk) {
      return parseText(new TextDecoder('utf-8').decode(chunk), identifier)
    }
    throw Error('Error while reading response body.')
  } catch (error) {
    console.error('@polar/client-dish', error)
    return { Information: 'Keine Informationen zum Denkmal gefunden' }
  }
}

export async function getPhoto(
  identifier: string,
  hostUrl = `${dishBaseUrl}/dish_opendata/Foto/`
): Promise<string> {
  const photoURL = `${hostUrl}${identifier}.jpg`
  const response = await fetch(photoURL)
  if (response.status !== 200) {
    const altText = 'Kein Foto gefunden'
    return altText
  }
  const blob = await response.blob()
  return new Promise((resolve) => {
    try {
      const reader = new FileReader()
      reader.onload = function () {
        resolve(this.result as string)
      }
      reader.readAsDataURL(blob)
    } catch (e) {
      console.error('@polar/client-dish', e)
      resolve('Kein Foto gefunden')
    }
  })
}

async function getHitInSearch(identifier: string): Promise<string> {
  const resultURL = `${dishBaseUrl}/dish_suche/html/denkmalErgebnisSeite.html?objektidEingabe=${identifier}`
  const response = await fetch(resultURL)
  if (response.status !== 200) {
    const altText = 'Kein Ergebnis in der Datenbank gefunden'
    return altText
  }
  return resultURL
}

// length seems acceptable, it's just some if/else domain logic
// eslint-disable-next-line max-lines-per-function
export async function extendGfi(
  featuresByLayerId: Record<string, GeoJsonFeature[]>
): Promise<
  Record<
    string,
    GeoJsonFeature<Geometry, DishFeatureProperties | GeoJsonProperties>[]
  >
> {
  let features = featuresByLayerId[denkmaelerWFS].filter((f) =>
    layerPool.includes(f.properties?.kat)
  )
  let sachgesamtheit = featuresByLayerId[denkmaelerWFS].find((f) =>
    sachgesamtheitPool.includes(f.properties?.kat)
  )

  if (sachgesamtheit) {
    sachgesamtheit.properties = {
      ...sachgesamtheit.properties,
      ...(await getText(sachgesamtheit.properties?.objektid)),
    }
  }

  /* if first extendGfi call and ObjektID present, make sure
   * that element with correct ID is used */
  if (first) {
    first = false
    const parameters = new URL(document.location as unknown as string)
      .searchParams
    const objektId = parameters.get('ObjektID')
    if (objektId) {
      const queriedFeature = features.find(
        (feature) => feature.properties?.objektid === objektId
      )
      if (queriedFeature) {
        features = [queriedFeature]
        if (features[0] === sachgesamtheit) {
          sachgesamtheit = undefined
        }
      } else if (sachgesamtheit?.properties?.objektid === objektId) {
        features = []
      }
    }
  }

  // if feature available, show smallest clicked
  // if kat9/10 available, show nested
  if (features.length) {
    return {
      [denkmaelerWFS]: await Promise.all([
        ...features.slice(-1).map(async (feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            ...(await getText(feature.properties?.objektid)),
            ...(sachgesamtheit
              ? {
                  sachgesamtheit,
                }
              : {}),
          },
        })),
      ]),
    }
  }

  // if only kat9/10 available, show as singular feature is shown
  if (sachgesamtheit) {
    return {
      [denkmaelerWFS]: [sachgesamtheit],
    }
  }

  // else show the nothing that is available
  return {}
}
