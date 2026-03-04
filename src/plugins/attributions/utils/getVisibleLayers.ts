import type { Collection } from 'ol'
import type BaseLayer from 'ol/layer/Base'

/**
 * looks for all Layers that are currently visible
 * @param layers - contains all Layers
 * @returns an array of LayerIDs
 */
export function getVisibleLayers(layers: Collection<BaseLayer>) {
	const layerIDs: string[] = []
	layers.forEach((layer) => {
		// Only layers added through the services include the id property
		if (layer.getVisible() && layer.get('id')) {
			layerIDs.push(layer.get('id'))
		}
	})
	return layerIDs
}
