import { GeoJSON, WFS } from 'ol/format'
import { FeatureCollection } from 'geojson'
import { PolarGeoJsonFeature, WFSVersion } from '../types'
import { getFeatureTitleFromPattern } from './getFeatureTitleFromPattern'

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
    const normalizedText = text.replace(
      /srsName="https?:\/\/www\.opengis\.net\/def\/crs\/epsg\/0\/(\d+)"/gi,
      'srsName="EPSG:$1"'
    )
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
      metadataSrsName?.split('::')?.[1] ??
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
