import type { Options as VectorOptions } from 'ol/layer/Vector'
import type { DrawPluginOptionsLayerStyle } from '../types'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style } from 'ol/style'

import { buildStyleParameters } from '@/lib/jsonStyleMapper'

/**
 * Creates a new VectorLayer and adds it to the map.
 * If certain style parameters, they are used instead of the default styling.
 *
 * @returns VectorLayer for the drawn features to reside in.
 */
export function createDrawLayer(
	id: string,
	style?: DrawPluginOptionsLayerStyle
) {
	const options: VectorOptions = { source: new VectorSource() }
	if (style) {
		options.style = new Style(buildStyleParameters(style))
	}
	const layer = new VectorLayer(options)
	layer.set('id', id)

	return layer
}
