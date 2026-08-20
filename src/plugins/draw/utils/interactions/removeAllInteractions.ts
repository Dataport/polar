import type Map from 'ol/Map'
import type { DisposableInteraction } from '../../types'

export function removeAllInteractions(
	map: Map,
	interactions: DisposableInteraction[]
) {
	interactions.forEach(({ interaction, dispose }) => {
		map.removeInteraction(interaction)
		dispose?.()
	})
}
