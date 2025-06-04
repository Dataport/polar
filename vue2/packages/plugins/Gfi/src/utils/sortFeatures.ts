import { Feature as GeoJsonFeature } from 'geojson'
import GeoJSON from 'ol/format/GeoJSON'
import { LineString, MultiLineString, MultiPolygon, Polygon } from 'ol/geom'

/**
 * If multiple features are selected on a layer, it is necessary to order them by size.
 * This means that the order of the features in the array is largest to smallest,
 * as the first feature of the array is rendered first from OpenLayers.
 *
 * This function is used with Array.prototype.sort to order the given features its order.
 * The meaning of the return value can be read up on {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description}.
 */
export default function (
  featureA: GeoJsonFeature,
  featureB: GeoJsonFeature,
  srsName: string
): number {
  const parser = new GeoJSON({
    dataProjection: srsName,
    featureProjection: srsName,
  })
  const geometryA = parser.readGeometry(featureA.geometry)
  const geometryB = parser.readGeometry(featureB.geometry)

  const aIsPolygon =
    geometryA instanceof Polygon || geometryA instanceof MultiPolygon
  const bIsPolygon =
    geometryB instanceof Polygon || geometryB instanceof MultiPolygon

  if (aIsPolygon && bIsPolygon) {
    return geometryB.getArea() - geometryA.getArea()
  }
  // If one of the geometries is not a polygon, Polygons are ordered to the front, then LineStrings, lastly Points
  if (aIsPolygon) {
    return -1
  }
  if (bIsPolygon) {
    return 1
  }
  const aIsLineString =
    geometryA instanceof LineString || geometryA instanceof MultiLineString
  const bIsLineString =
    geometryB instanceof LineString || geometryB instanceof MultiLineString

  if (aIsLineString && bIsLineString) {
    return 0
  }
  if (aIsLineString) {
    return -1
  }
  if (bIsLineString) {
    return 1
  }
  return 0
}
