import type { Feature, FeatureCollection } from 'geojson'
import type { Circle, LineString, Point, Polygon } from 'ol/geom'
import type VectorSource from 'ol/source/Vector'
import type { Ref } from 'vue'
import type { GeometryType } from '../../types'

import { Style } from 'ol/style'

export function drawSourceToFeatureCollection(
	drawSource: VectorSource,
	featureCollection: Ref<FeatureCollection<GeometryType>>
) {
	const features = drawSource.getFeatures().map((feature) => {
		const geometry = feature.getGeometry() as
			Circle | LineString | Point | Polygon
		const type = geometry.getType()
		const style = feature.getStyle()
		const text =
			type === 'Point' && style instanceof Style ? style.getText() : undefined
		const isCircle = type === 'Circle'

		const jsonFeature: Feature = {
			type: 'Feature',
			properties: Object.fromEntries(
				Object.entries(feature.getProperties()).filter(
					([property]) => property !== 'geometry'
				)
			),
			geometry: {
				// @ts-expect-error | A LinearRing can currently not be drawn
				type: isCircle ? 'Point' : type,
				// @ts-expect-error | The coordinates are in the correct format
				coordinates: isCircle
					? (geometry as Circle).getCenter()
					: geometry.getCoordinates(),
			},
		}

		// TODO: the radius property key has always been used like that, but the usage isn't safe as soon as we allow more properties / external layers. We shall then probably use _polarkeyboardcat as a prefix and hope for the best.
		if (jsonFeature.properties) {
			if (isCircle) {
				jsonFeature.properties.radius = (geometry as Circle).getRadius()
			}

			if (text) {
				jsonFeature.properties.text = text.getText()
				jsonFeature.properties.textFont = text.getFont()
			}

			if (style) {
				// TODO: reverse jsonStyleMapper on style (difficulty level: archmage)
				// jsonFeature.properties.style = {}
			}

			// TODO: measurement lines/polygons must be saved with measurements, should work in the same style as it's done for text
		}

		return jsonFeature
	})

	featureCollection.value = {
		...featureCollection.value,
		features: features as Feature<GeometryType>[],
	}
}
