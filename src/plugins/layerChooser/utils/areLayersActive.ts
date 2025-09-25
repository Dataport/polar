import type { LayerConfiguration } from '@/core'

/**
 * Returns a boolean list which contains the attributions for every visible Layer.
 *
 * @param layers - layers carrying setup information.
 * @param zoom - the zoom the map is currently in.
 * @returns information about layer active property.
 */
export const areLayersActive = (layers: LayerConfiguration[], zoom: number) =>
	layers.filter((layer) => {
		let { minZoom, maxZoom } = layer
		if (typeof minZoom === 'undefined') {
			minZoom = 0
		}
		if (typeof maxZoom === 'undefined') {
			maxZoom = Number.MAX_SAFE_INTEGER
		}
		return minZoom <= zoom && zoom <= maxZoom
	})
