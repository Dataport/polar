import type { Map } from 'ol'

/**
 * Returns the layer with the given ID.
 *
 * @param map - The OpenLayers map instance
 * @param layerId - ID of the layer
 * @returns The layer with the given ID, or `undefined` if no such layer exists
 */
export function findLayer(map: Map, layerId: string) {
	return map.getAllLayers().find((layer) => layer.get('id') === layerId)
}
