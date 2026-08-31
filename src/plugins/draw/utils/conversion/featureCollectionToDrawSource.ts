import type { FeatureCollection, Point } from 'geojson'
import type Feature from 'ol/Feature'
import type VectorSource from 'ol/source/Vector'
import type { GeometryType } from '../../types'

import GeoJSON from 'ol/format/GeoJSON'
import { Circle } from 'ol/geom'

import { createTextStyle } from '../createTextStyle'

export function featureCollectionToDrawSource(
	featureCollection: FeatureCollection<GeometryType>,
	drawSource: VectorSource
) {
	const features = featureCollection.features.map((feature) => {
		const olFeature = new GeoJSON().readFeature(feature) as Feature
		if (!feature.properties) {
			return olFeature
		}
		const { radius, style, text, textFont } = feature.properties
		const isCircle = typeof radius === 'number'

		if (isCircle) {
			olFeature.setGeometry(
				new Circle((feature.geometry as Point).coordinates, radius)
			)
		}

		if (style) {
			// relevant when feature styling is implemented (see reverse function)
			// import { buildStyleParameters } from '@/lib/jsonStyleMapper'
			// olFeature.setStyle(buildStyleParameters(style))
		}

		if (text) {
			const textStyle = createTextStyle(text)
			if (textFont) {
				textStyle.getText()?.setFont(textFont)
			}

			olFeature.setStyle(textStyle)
		}

		// TODO: measurement lines/polygons must be restored with measurements, should work in the same fashion as for text

		return olFeature
	})

	drawSource.addFeatures(features)
}
