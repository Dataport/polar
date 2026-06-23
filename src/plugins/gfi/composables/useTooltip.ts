import { Feature, Map, MapBrowserEvent, Overlay } from 'ol'
import { onScopeDispose } from 'vue'

import { updateTooltip } from '../utils/updateTooltip'

export function useTooltip(
	map: Map,
	tooltipGenerators: Record<string, (feature: Feature) => [string, string][]>
) {
	if (!Object.keys(tooltipGenerators).length) {
		return
	}

	const overlay = new Overlay({
		positioning: 'bottom-center',
		offset: [0, -5],
	})
	map.addOverlay(overlay)

	let teardownTooltip: (() => void) | null = null
	map.on('pointermove', (evt) => {
		if (teardownTooltip) {
			teardownTooltip()
		}

		teardownTooltip = updateTooltip(
			evt as MapBrowserEvent<PointerEvent>,
			overlay,
			tooltipGenerators
		)
	})
	onScopeDispose(() => {
		if (teardownTooltip) {
			teardownTooltip()
		}
		map.removeOverlay(overlay)
	})
}
