import type { Collection } from 'ol'
import type BaseLayer from 'ol/layer/Base'

/**
 * Looks for all Layers that are currently visible.
 *
 * @param layers - contains all Layers
 * @returns an array of LayerIDs.
 *
 * @remarks
 * Only layers added through the services include the id property.
 */
export function getVisibleLayers(layers: Collection<BaseLayer>) {
	return layers
		.getArray()
		.filter((layer) => layer.getVisible() && layer.get('id'))
		.map((layer) => layer.get('id'))
}
