import { Feature, Map, Overlay } from 'ol'
import { onScopeDispose } from 'vue'

import { updateTooltip } from '../utils/updateTooltip'

export function useTooltip(options: {
	map: Map
	tooltipGenerators: Record<string, (feature: Feature) => [string, string][]>
}) {
	if (!Object.keys(options.tooltipGenerators).length) {
		return
	}

	const overlay = new Overlay({
		positioning: 'bottom-center',
		offset: [0, -5],
	})
	options.map.addOverlay(overlay)

	let teardownTooltip: (() => void) | null = null
	options.map.on('pointermove', (evt) => {
		if (teardownTooltip) {
			teardownTooltip()
		}

		teardownTooltip = updateTooltip(evt, overlay, options.tooltipGenerators)
	})
	onScopeDispose(() => {
		if (teardownTooltip) {
			teardownTooltip()
		}
		options.map.removeOverlay(overlay)
	})
}
