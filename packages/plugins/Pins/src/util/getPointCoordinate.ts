import { transform } from 'ol/proj'
import { getCenter } from 'ol/extent'

import {
  Circle,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
} from 'ol/geom'

const geoms = {
  Circle,
  LinearRing,
  LineString,
  MultiLineString,
  MultiPoint,
  MultiPolygon,
  Point,
  Polygon,
}

export default function (
  sourceEpsg,
  targetEpsg,
  geometryType,
  geometryCoordinates
) {
  const Type = geoms[geometryType || 'Point']
  const instance = new Type(geometryCoordinates)
  let pointCoordinate = getCenter(instance.getExtent())

  // return random point if bbox center is not in shape
  if (
    (geometryType === 'Polygon' || geometryType === 'MultiPolygon') &&
    !instance.intersectsCoordinate(pointCoordinate)
  ) {
    pointCoordinate =
      geometryType === 'Polygon'
        ? instance.getInteriorPoint().getFirstCoordinate()
        : instance.getInteriorPoints().getFirstCoordinate()
  }

  return sourceEpsg === targetEpsg
    ? pointCoordinate
    : transform(pointCoordinate, sourceEpsg, targetEpsg)
}
