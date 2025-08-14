import type { Map } from 'ol'
import type { Interaction } from 'ol/interaction'
import { createPanAndZoomInteractions } from '../interactions'

let interactions: Interaction[] = []

export function updateDragAndZoomInteractions(
	map: Map,
	hasWindowSize: boolean,
	hasSmallScreen: boolean
) {
	for (const interaction of interactions) {
		map.removeInteraction(interaction)
	}
	interactions = createPanAndZoomInteractions(hasWindowSize, hasSmallScreen)
	for (const interaction of interactions) {
		map.addInteraction(interaction)
	}
}
