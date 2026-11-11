import { GeoJSON, WFS } from 'ol/format'
import { FeatureCollection } from 'geojson'
import { PolarGeoJsonFeature, WFSVersion } from '../types'
import { getFeatureTitleFromPattern } from './getFeatureTitleFromPattern'

// e.g. http://www.opengis.net/def/crs/EPSG/0/3857 or .../EPSG/9.9.1/3857 (OGC 09-048r6)
const ogcCrsUriPattern =
  /srsName="https?:\/\/www\.opengis\.net\/def\/crs\/epsg\/[^/"]+\/(\d+)"/gi
// e.g. urn:ogc:def:crs:EPSG::3857 or urn:ogc:def:crs:EPSG:6.18:3857 (OGC 07-092r1)
const ogcCrsUrnPattern = /srsName="urn:(?:x-)?ogc:def:crs:epsg:[^:"]*:(\d+)"/gi

/**
 * Normalizes OGC CRS URIs and URNs in srsName attributes to `EPSG:<code>`.
 * Note that OpenLayers interprets URI/URN identifiers of geographic CRSs
 * (e.g. EPSG:4326) with `neu` axis orientation, whereas `EPSG:<code>` is read
 * as `enu`; hence, axis order follows the `EPSG:<code>` interpretation.
 */
const normalizeSrsNames = (text: string) =>
  text
    .replace(ogcCrsUriPattern, 'srsName="EPSG:$1"')
    .replace(ogcCrsUrnPattern, 'srsName="EPSG:$1"')

/**
 * Parses the response from a GetRequest to a WFS.
 *
 * @param response - Response from the fetch request.
 * @param title - {@link AdditionalSearchOptions.title}
 * @param useTitleAsPattern - whether title contains patterns from config
 * @param version - WFS version of the response; defaults to 1.1.0
 */
export function parseWfsResponse(
  response: Response,
  title: string | string[] | undefined,
  useTitleAsPattern: boolean,
  version?: WFSVersion
): Promise<FeatureCollection> {
  const features: PolarGeoJsonFeature[] = []
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features,
  }

  return response.text().then((text) => {
    const normalizedText = normalizeSrsNames(text)
    const parser = version ? new WFS({ version }) : new WFS()
    const writer = new GeoJSON()
    const parsedFeatures = parser.readFeatures(normalizedText)
    // OL 10.4's metadata reader treats WFS 2.0 members as a metadata array.
    const metadataSrsName =
      version === '2.0.0'
        ? undefined
        : (
            parser.readFeatureCollectionMetadata(normalizedText) as
              | { srsName?: string }
              | undefined
          )?.srsName
    const epsgCode =
      metadataSrsName?.match(/EPSG:(\d+)/i)?.[1] ??
      // if srs not on root node, but on children, take first-best match
      normalizedText.match(/srsName="[^"]*EPSG:(\d+)/i)?.[1]

    parsedFeatures.forEach((f) => {
      const featureObject = JSON.parse(writer.writeFeature(f))
      featureObject.title = ''
      if (title) {
        if (useTitleAsPattern) {
          featureObject.title = getFeatureTitleFromPattern(
            featureObject,
            title as string[]
          )
        } else {
          featureObject.title = Array.isArray(title)
            ? title.map((part) => featureObject.properties[part]).join(' ')
            : featureObject.properties[title]
        }
      }
      if (epsgCode) {
        featureObject.epsg = `EPSG:${epsgCode}`
      }
      features.push(featureObject)
    })

    return featureCollection
  })
}
