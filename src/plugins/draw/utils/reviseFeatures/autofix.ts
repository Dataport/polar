import type {
	FeatureCollection,
	Feature as GeoJsonFeature,
	MultiPolygon,
	Polygon,
} from 'geojson'
import type { GeometryType } from '../../types'

import { cleanCoords, unkinkPolygon } from '@turf/turf'

export const autofixFeatureCollection = (
	revisedFeatureCollection: FeatureCollection<GeometryType>
) => ({
	...revisedFeatureCollection,
	features: revisedFeatureCollection.features.reduce<
		GeoJsonFeature<GeometryType>[]
	>((accumulator, feature) => {
		if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
			accumulator.push(
				...unkinkPolygon(
					cleanCoords(feature) as GeoJsonFeature<Polygon | MultiPolygon>
				).features
			)
		} else {
			accumulator.push(cleanCoords(feature))
		}
		return accumulator
	}, []),
})
