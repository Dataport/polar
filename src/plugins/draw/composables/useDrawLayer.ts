import type { Map } from 'ol'
import type { DrawPluginOptionsLayerStyle, PolarVectorOptions } from '../types'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style } from 'ol/style'
import { onScopeDispose } from 'vue'

import { buildStyleParameters } from '@/lib/jsonStyleMapper'

/**
 * Creates a new VectorLayer and adds it to the map.
 * If certain style parameters, they are used instead of the default styling.
 *
 * @returns VectorLayer for the drawn features to reside in.
 */
export function useDrawLayer(
	map: Map,
	id: string,
	style?: DrawPluginOptionsLayerStyle
) {
	const options: PolarVectorOptions = { source: new VectorSource() }
	if (style) {
		options.style = new Style(buildStyleParameters(style))
	}
	const layer = new VectorLayer(options)
	layer.set('id', id)

	map.addLayer(layer)
	onScopeDispose(() => {
		map.removeLayer(layer)
	})

	return layer
}
