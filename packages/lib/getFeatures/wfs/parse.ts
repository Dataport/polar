import { GeoJSON, WFS } from 'ol/format'
import { FeatureCollection } from 'geojson'
import { PolarGeoJsonFeature } from '../types'
import { getFeatureTitleFromPattern } from './getFeatureTitleFromPattern'

/**
 * Parses the response from a GetRequest to a WFS.
 *
 * @param response - Response from the fetch request.
 * @param title - {@link AdditionalSearchOptions.title}
 * @param useTitleAsPattern - whether title contains patterns from config
 */
export function parseWfsResponse(
  response: Response,
  title: string | string[] | undefined,
  useTitleAsPattern: boolean
): Promise<FeatureCollection> {
  const features: PolarGeoJsonFeature[] = []
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features,
  }

  return response.text().then((text) => {
    const parser = new WFS()
    const writer = new GeoJSON()
    const parsedFeatures = parser.readFeatures(text)
    // srsName is there, I've seen it – probably a bug in OL?
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { srsName } = parser.readFeatureCollectionMetadata(text)

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
      if (srsName) {
        featureObject.epsg = 'EPSG:' + srsName.split('::')[1]
      }
      features.push(featureObject)
    })

    return featureCollection
  })
}
