import type { Feature as GeoJsonFeature } from 'geojson'
import type { Map } from 'ol'
import type { FeatureLike } from 'ol/Feature'
import type VectorLayer from 'ol/layer/Vector'

import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'

const writer = new GeoJSON()

const getNestedFeatures = (
	feature: Feature | FeatureLike
): Feature | Feature[] | FeatureLike =>
	feature instanceof Feature
		? feature.get('features')?.length
			? feature.get('features')
			: feature
		: feature

/**
 * Returns features from GeoJSON layer as GeoJSON.
 */
export default ({
	map,
	coordinateOrExtent,
	layer,
}: {
	map: Map
	coordinateOrExtent: [number, number] | [number, number, number, number]
	layer: VectorLayer
}): Promise<GeoJsonFeature[]> =>
	Promise.resolve(
		(coordinateOrExtent.length === 2
			? map.getFeaturesAtPixel(map.getPixelFromCoordinate(coordinateOrExtent), {
					layerFilter: (candidate) => candidate === layer,
				})
			: // @ts-expect-error | Layers reaching this place have a source
				layer
					.getSource()
					.getFeaturesInExtent(coordinateOrExtent)
					.map(getNestedFeatures)
					.flat(1)
		)
			.map((feature) =>
				feature instanceof Feature
					? JSON.parse(writer.writeFeature(feature))
					: false
			)
			// remove FeatureLikes
			.filter((x) => x)
	)
