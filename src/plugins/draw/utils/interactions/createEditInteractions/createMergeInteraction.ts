import type { Feature as GeoJsonFeature, MultiPolygon, Polygon } from 'geojson'
import type Feature from 'ol/Feature'
import type VectorSource from 'ol/source/Vector'

import { booleanIntersects } from '@turf/boolean-intersects'
import { union } from '@turf/union'
import { GeoJSON } from 'ol/format'
import Draw from 'ol/interaction/Draw'

const converter = new GeoJSON()

export const createMergeInteraction = (drawSource: VectorSource) => {
	const draw = new Draw({ type: 'Polygon' })

	draw.on('drawend', (e) => {
		const mergePolygon = converter.writeFeatureObject(
			e.feature
		) as GeoJsonFeature<Polygon>
		const drawFeatures = drawSource.getFeatures()

		// sort everything into a.) things to combine b.) things not to touch
		const intersectedPolygons: GeoJsonFeature<Polygon | MultiPolygon>[] = []
		const nextFeatures = drawFeatures.reduce<Feature[]>(
			(accumulator, drawFeature) => {
				const type = drawFeature.getGeometry()?.getType() ?? ''
				const drawFeatureAsGeoJson = converter.writeFeatureObject(drawFeature)
				if (
					['Polygon', 'MultiPolygon'].includes(type) &&
					booleanIntersects(mergePolygon, drawFeatureAsGeoJson)
				) {
					intersectedPolygons.push(
						drawFeatureAsGeoJson as GeoJsonFeature<Polygon | MultiPolygon>
					)
				} else {
					accumulator.push(drawFeature)
				}
				return accumulator
			},
			[]
		)

		const mergedFeature = union({
			type: 'FeatureCollection',
			features: [mergePolygon, ...intersectedPolygons],
		})

		nextFeatures.push(converter.readFeature(mergedFeature) as Feature)

		drawSource.clear()
		drawSource.addFeatures(nextFeatures)
	})

	return draw
}
