import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style'

import { buildStyle } from '@/lib/jsonStyleMapper'

/**
 * Creates a new VectorLayer.
 * If certain style parameters, they are used instead of the default styling.
 *
 * @returns VectorLayer for the drawn features to reside in.
 */
export function createDrawLayer(style /* ?: DrawStyle */, id) {
	const options /*: PolarVectorOptions */ = { source: new VectorSource() }
	if (style) {
		// TODO: The styling for Stroke and Circle have many more options.
		//  Thus, it could be interesting to divide this function even further
		//  so that every possible option can be used.
		// const { fill, stroke, circle } = style
		options.style = buildStyle(style)

		/*
		options.style = new Style({
			fill: new Fill(fill),
			stroke: new Stroke(stroke),
			image: new CircleStyle({
				radius: circle.radius,
				fill: new Fill({ color: circle.fillColor }),
			}),
		})
			*/
	}
	const layer = new VectorLayer(options)
	layer.set('id', id)
	return layer
}
