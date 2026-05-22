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
		const style = feature.properties?.style
		const isCircle =
			feature.properties && typeof feature.properties.radius !== 'undefined'
		const text = feature.properties?.text
		const textFont = feature.properties?.textFont

		const olFeature = new GeoJSON().readFeature(feature) as Feature

		if (isCircle) {
			olFeature.setGeometry(
				new Circle(
					(feature.geometry as Point).coordinates,
					// Known due to isCircle. TypeScript, you should be able to solve this.
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					feature.properties!.radius as number
				)
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
