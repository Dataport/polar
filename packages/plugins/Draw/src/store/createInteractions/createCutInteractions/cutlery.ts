import { polygon, featureCollection } from '@turf/helpers'
import { buffer } from '@turf/buffer'
import { difference } from '@turf/difference'
import { unkinkPolygon } from '@turf/unkink-polygon'
import {
  Feature as GeoJsonFeature,
  Polygon as GeoJsonPolygon,
  MultiPolygon as GeoJsonMultiPolygon,
  LineString as GeoJsonLineString,
} from 'geojson'
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon'
import { lineIntersect } from '@turf/line-intersect'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import { GeoJSON } from 'ol/format'
import { ProjectionInfo } from './types'

const polygonTypes = ['Polygon', 'MultiPolygon']
export const converter = new GeoJSON()

const cutCuttableWithCutter = (
  cuttable: GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>,
  cutter: GeoJsonFeature<GeoJsonLineString>
): GeoJsonFeature<GeoJsonPolygon>[] => {
  // error by less than 4 water molecule widths deemed acceptable for surveying
  const cutterAsPolygon = buffer(cutter, 0.000001, {
    units: 'millimeters',
  }) as GeoJsonFeature<GeoJsonPolygon>
  const cuts = difference(featureCollection([cuttable, cutterAsPolygon]))

  if (cuts === null) {
    const errorText = 'Cutting resulted in geometry destruction.'
    console.error(
      '@polar/plugin-draw: ',
      errorText,
      'cuttable: ',
      cuttable,
      'cutter: ',
      cutter
    )
    throw new Error(errorText)
  }

  if (cuts.geometry.type === 'MultiPolygon') {
    return cuts.geometry.coordinates
      .map((coordinates) => polygon(coordinates))
      .map((cuttable) => cutCuttableWithCutter(cuttable, cutter))
      .flat(1)
  }

  return [cuts as GeoJsonFeature<GeoJsonPolygon>]
}

export const cutCuttablesWithCutter = (
  cuttables: GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>[],
  cutter: GeoJsonFeature<GeoJsonLineString>
): GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>[] => {
  const unkinkedCuttables = cuttables.reduce((accumulator, current) => {
    accumulator.push(...unkinkPolygon(current).features)
    return accumulator
  }, [] as GeoJsonFeature<GeoJsonPolygon>[])

  return unkinkedCuttables
    .map((cuttable) => cutCuttableWithCutter(cuttable, cutter))
    .flat(1)
}

const intersectionCountImpliesCuttability = (count: number) =>
  count > 0 && count % 2 === 0

const wouldCutterCutCandidate = (
  cutter: GeoJsonFeature<GeoJsonLineString>,
  candidate: GeoJsonFeature
) =>
  // drawing may initially turn out to be a point (1-coordinate-line-string)
  cutter.geometry.type === 'LineString' &&
  // check if candidate is actually a polygon, we don't cut anything else today
  polygonTypes.includes(candidate.geometry.type) &&
  // start and end do not reside inside candidate (cut through, not cut in)
  [
    cutter.geometry.coordinates[0],
    cutter.geometry.coordinates[cutter.geometry.coordinates.length - 1],
  ].every(
    (coordinate) =>
      !booleanPointInPolygon(
        coordinate,
        candidate as GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>
      )
  ) &&
  // cuttable is cut an even amount of times > 0, i.e. is entered and left
  intersectionCountImpliesCuttability(
    lineIntersect(
      cutter,
      candidate as GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>
    ).features.length
  )

export const splitByCuttability = (
  drawSource: VectorSource,
  cutter: GeoJsonFeature<GeoJsonLineString>,
  projectionInfo: ProjectionInfo
): [GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>[], Feature[]] =>
  drawSource.getFeatures().reduce(
    ([cuttables, uncuttables], current) => {
      const currentAsGeoJson = converter.writeFeatureObject(
        current,
        projectionInfo
      )
      if (wouldCutterCutCandidate(cutter, currentAsGeoJson)) {
        cuttables.push(
          currentAsGeoJson as GeoJsonFeature<
            GeoJsonPolygon | GeoJsonMultiPolygon
          >
        )
      } else {
        uncuttables.push(current)
      }
      return [cuttables, uncuttables]
    },
    [[], []] as [
      GeoJsonFeature<GeoJsonPolygon | GeoJsonMultiPolygon>[],
      Feature[]
    ]
  )
