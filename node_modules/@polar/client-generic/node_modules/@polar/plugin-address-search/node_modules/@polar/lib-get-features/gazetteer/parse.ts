import { transform as transformCoordinates } from 'ol/proj'
import { MemberSuffix } from '@polar/lib-custom-types'
import { FeatureCollection, GeoJsonProperties, Point } from 'geojson'
import { PolarGeoJsonFeature } from '../types'

/**
 * Parses the response from a GetRequest to a WFS-G.
 *
 * @param response - Response from the fetch request.
 * @param memberSuffix - {@link MemberSuffix}
 * @param namespaces - The namespaces of the features of the WFS service.
 * @param epsg - The projection code of the map.
 * @param title - {@link AdditionalSearchOptions.title}
 */
export function parseGazetteerResponse(
  response: Response,
  memberSuffix: MemberSuffix,
  namespaces: string[],
  epsg: `EPSG:${string}`,
  title?: string | string[]
): Promise<FeatureCollection> {
  return response.text().then((text) => {
    const features: PolarGeoJsonFeature[] = []
    const gmlFeatures = new DOMParser()
      .parseFromString(text, 'application/xml')
      .getElementsByTagName(`wfs:${memberSuffix}`)
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features,
    }
    let geometry: Point

    if (gmlFeatures.length === 0) {
      return featureCollection
    }

    const gmlFeatureArray = Array.from(gmlFeatures)
    const featureEPSG =
      gmlFeatureArray[0].getElementsByTagName('iso19112:position').length > 0
        ? `EPSG:${
            // @ts-expect-error | The TS compiler says 'TS2531: Object is possibly 'null'.' which is valid, but not the case with this document
            gmlFeatureArray[0]
              .getElementsByTagName('iso19112:position')[0]
              .getElementsByTagName('gml:Point')[0]
              .attributes[1].textContent.split('::')[1]
          }`
        : epsg

    gmlFeatureArray.forEach((feature) => {
      const properties: GeoJsonProperties = Object.values(
        // @ts-expect-error | The TS compiler says 'TS2556: A spread argument must either have a tuple type or be passed to a rest parameter.' which might be true, but this works as intended
        ...namespaces.map((namespace) =>
          feature.getElementsByTagNameNS(namespace, '*')
        )
      ).reduce(
        (acc, curr) => ({ ...acc, [curr.localName]: curr.textContent }),
        {}
      )
      if (feature.getElementsByTagName('iso19112:position').length > 0) {
        const coordinates =
          // @ts-expect-error | The TS compiler says 'TS2531: Object is possibly 'null'.' which is valid, but not the case with this document
          feature
            .getElementsByTagName('iso19112:position')[0]
            .getElementsByTagName('gml:pos')[0]
            .textContent.split(' ')
            .map((coordinate) => parseFloat(coordinate))
        geometry = {
          type: 'Point',
          coordinates:
            featureEPSG === epsg
              ? coordinates
              : transformCoordinates(coordinates, featureEPSG, epsg),
        }
      }
      if (
        feature.getElementsByTagName('iso19112:geographicExtent').length > 0
      ) {
        const coordinates =
          // @ts-expect-error | The TS compiler says 'TS2531: Object is possibly 'null'.' which is valid, but not the case with this document
          feature
            .getElementsByTagName('iso19112:geographicExtent')[0]
            .getElementsByTagName('gml:posList')[0]
            .textContent.split(' ')
            .map((coordinate) => parseFloat(coordinate))
            .reduce(
              (accumulator, _, index, array) =>
                index % 2 === 0
                  ? [...accumulator, [array[index], array[index + 1]]]
                  : accumulator,
              <number[][]>[]
            )
        properties.geographicExtent = {
          type: 'Polygon',
          coordinates: [
            featureEPSG === epsg
              ? coordinates
              : coordinates.map((coordinate) =>
                  transformCoordinates(coordinate, featureEPSG, epsg)
                ),
          ],
        }
      }
      const geoFeature: PolarGeoJsonFeature = {
        epsg,
        type: 'Feature',
        geometry,
        properties,
      }
      if (title && title.length > 0) {
        geoFeature.title = Array.isArray(title)
          ? title
              .reduce(
                (previous, current) => previous + properties[current] + ' ',
                ''
              )
              .slice(0, -1)
          : properties[title]
      }
      features.push(geoFeature)
    })

    return featureCollection
  })
}
