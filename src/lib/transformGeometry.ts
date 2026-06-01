import type { Geometry, Point, Polygon } from 'geojson'

import { transform as transformCoordinates } from 'ol/proj'

/**
 * Transforms the coordinates of a GeoJSON geometry from one EPSG projection to another.
 *
 * @remarks
 * Currently supports only Point and Polygon geometries.
 * For unsupported geometry types, an error is thrown.
 *
 * @param geometry - The GeoJSON geometry to transform.
 * @param sourceEpsg - The EPSG code of the source projection.
 * @param targetEpsg - The EPSG code of the target projection.
 * @returns The transformed GeoJSON geometry.
 */
export function transformGeometry(
	geometry: Geometry,
	sourceEpsg: string,
	targetEpsg: string
): Point | Polygon {
	if (geometry.type === 'Point') {
		return {
			...geometry,
			coordinates: transformCoordinates(
				geometry.coordinates,
				sourceEpsg,
				targetEpsg
			),
		}
	} else if (geometry.type === 'Polygon') {
		return {
			...geometry,
			coordinates: geometry.coordinates.map((ring) =>
				ring.map((coord) => transformCoordinates(coord, sourceEpsg, targetEpsg))
			),
		}
	}
	throw new Error(`Unsupported geometry type: ${geometry.type}`)
}
