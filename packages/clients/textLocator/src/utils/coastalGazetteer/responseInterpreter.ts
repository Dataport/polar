import { Feature, FeatureCollection } from 'geojson'
import levenshtein from 'js-levenshtein'
import { MultiPolygon } from 'ol/geom'
import { wgs84ProjectionCode } from '../common'
import { GeometrySearchState } from '../../plugins/GeometrySearch/types'
import {
  ResponseGeom,
  ResponseName,
  ResponsePayload,
  ResponseResult,
} from './types'
import { geoJson, idPrefixes, wellKnownText } from './common'
import { getPrimaryName } from './getPrimaryName'

// arbitrary sort based on input – prefer 1. startsWith 2. closer string
export const sorter =
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

export const getEmptyFeatureCollection =
  (): GeometrySearchState['featureCollection'] => ({
    type: 'FeatureCollection',
    features: [],
  })

// for now: merge all geometries, independent of their timeframe
const geoJsonifyAllGeometries = (
  geoms: ResponseGeom[],
  epsg: `EPSG:${string}`
) =>
  geoJson.writeGeometryObject(
    geoms.reduce(
      (multiPolygon, currentGeom) =>
        (
          wellKnownText.readGeometry(currentGeom.WKT, {
            dataProjection: wgs84ProjectionCode,
            featureProjection: epsg,
          }) as MultiPolygon
        )
          .getPolygons()
          .reduce((accumulator, currentPolygon) => {
            accumulator.appendPolygon(currentPolygon)
            return accumulator
          }, multiPolygon),
      new MultiPolygon([])
    )
  )

const featurify =
  (epsg: `EPSG:${string}`, searchPhrase: string | null) =>
  (
    feature: ResponseResult
  ): GeometrySearchState['featureCollection']['features'][number] | null => {
    const title = searchPhrase
      ? feature.names.sort(sorter(searchPhrase, 'Name'))[0]?.Name || '???'
      : getPrimaryName(feature.names)
    return {
      type: 'Feature',
      geometry: feature.geoms.length
        ? geoJsonifyAllGeometries(feature.geoms, epsg)
        : { type: 'Point', coordinates: [] },
      id: feature.id,
      properties: {
        title,
        names: feature.names,
        geometries: feature.geoms,
      },
      // @ts-expect-error | used in POLAR for text display
      title,
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
      if (feature.id.includes(idPrefixes.country)) {
        return accumulator
      }
      const geoJsonFeature = featurify(epsg, searchPhrase)(feature)
      if (geoJsonFeature === null) {
        return accumulator
      }
      accumulator.push(geoJsonFeature)
      return accumulator
    }, [] as GeometrySearchState['featureCollection']['features'])
  )

  if (searchPhrase) {
    featureCollection.features = featureCollection.features.sort(
      sorter(searchPhrase, 'title')
    )
  }

  return featureCollection
}
