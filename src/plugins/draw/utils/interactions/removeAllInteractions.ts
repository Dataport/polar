import type Interaction from 'ol/interaction/Interaction'
import type Map from 'ol/Map'

export function removeAllInteractions(map: Map, interactions: Interaction[]) {
	interactions.forEach((interaction) => {
		map.removeInteraction(interaction)
		// @ts-expect-error | "un on removal" riding piggyback as _onRemove
		interaction._onRemove?.()
	})
}
