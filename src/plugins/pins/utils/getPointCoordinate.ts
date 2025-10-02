import type { GeoJsonGeometryTypes } from 'geojson'
import type { Coordinate } from 'ol/coordinate'
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
import { transform } from 'ol/proj'
import { getCenter } from 'ol/extent'

// TODO(dopenguin): This function is exported as part of the module -> Currently used in DISH

/* eslint-disable @typescript-eslint/naming-convention */
const geometries = {
	Circle,
	LinearRing,
	LineString,
	MultiLineString,
	MultiPoint,
	MultiPolygon,
	Point,
	Polygon,
}
/* eslint-enable @typescript-eslint/naming-convention */

export function getPointCoordinate(
	sourceEpsg: string,
	targetEpsg: string,
	geometryType: Exclude<GeoJsonGeometryTypes, 'GeometryCollection'>,
	coordinate: Coordinate
) {
	const instance = new geometries[geometryType](coordinate)
	let pointCoordinate = getCenter(instance.getExtent())

	// return random point if bbox center is not in shape
	if (
		(geometryType === 'Polygon' || geometryType === 'MultiPolygon') &&
		!instance.intersectsCoordinate(pointCoordinate)
	) {
		pointCoordinate = (
			instance.getType() === 'Polygon'
				? (instance as Polygon).getInteriorPoint()
				: (instance as MultiPolygon).getInteriorPoints()
		).getFirstCoordinate()
	}

	return sourceEpsg === targetEpsg
		? pointCoordinate
		: transform(pointCoordinate, sourceEpsg, targetEpsg)
}
