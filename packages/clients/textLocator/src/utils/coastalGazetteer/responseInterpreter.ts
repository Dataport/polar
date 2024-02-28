import { Feature, FeatureCollection } from 'geojson'
import levenshtein from 'js-levenshtein'
import { wgs84ProjectionCode } from '../common'
import { ResponseName, ResponsePayload, ResponseResult } from './types'
import { geoJson, ignoreIds, wellKnownText } from './common'

// arbitrary sort based on input – prefer 1. startsWith 2. closer string
const sorter =
  (searchPhrase: string, sortKey: string) =>
  (a: ResponseName | Feature, b: ResponseName | Feature) => {
    const aStartsWith = a[sortKey].startsWith(searchPhrase)
    const bStartsWith = b[sortKey].startsWith(searchPhrase)

    return aStartsWith && !bStartsWith
      ? -1
      : !aStartsWith && bStartsWith
      ? 1
      : levenshtein(a[sortKey], searchPhrase) -
        levenshtein(b[sortKey], searchPhrase)
  }

export const getEmptyFeatureCollection = (): FeatureCollection => ({
  type: 'FeatureCollection',
  features: [],
})

const featurify =
  (epsg: `EPSG:${string}`, searchPhrase: string | null) =>
  (feature: ResponseResult): Feature | null => {
    const geometries = feature.geoms.filter(
      (geom) => !ignoreIds.geometries.includes(geom.GeomID)
    )
    return {
      type: 'Feature',
      geometry: geometries.length
        ? geoJson.writeGeometryObject(
            // NOTE arbitrarily, the first geometry is used
            wellKnownText.readGeometry(geometries[0].WKT, {
              dataProjection: wgs84ProjectionCode,
              featureProjection: epsg,
            })
          )
        : { type: 'Point', coordinates: [] },
      id: feature.id,
      properties: {
        names: feature.names,
        geometries,
      },
      // @ts-expect-error | used in POLAR for text display
      title:
        (searchPhrase
          ? feature.names.sort(sorter(searchPhrase, 'Name'))
          : feature.names)[0]?.Name || 'textLocator.addressSearch.unnamed',
    }
  }

export const featureCollectionify = (
  fullResponse: ResponsePayload,
  epsg: `EPSG:${string}`,
  searchPhrase: string | null
): FeatureCollection => {
  const featureCollection = getEmptyFeatureCollection()
  featureCollection.features.push(
    ...fullResponse.results.reduce((accumulator, feature) => {
      if (ignoreIds.global.includes(feature.id)) {
        return accumulator
      }
      const featurified = featurify(epsg, searchPhrase)(feature)
      if (featurified === null) {
        return accumulator
      }
      accumulator.push(featurified)
      return accumulator
    }, [] as Feature[])
  )

  if (searchPhrase) {
    featureCollection.features = featureCollection.features.sort(
      sorter(searchPhrase, 'title')
    )
  }

  return featureCollection
}
