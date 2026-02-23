import type { Map } from 'ol'

import { platformModifierKeyOnly } from 'ol/events/condition'
import Draw, {
	createBox,
	type Options as DrawOptions,
} from 'ol/interaction/Draw'
import { Fill, Stroke, Style } from 'ol/style'
import { onScopeDispose, ref } from 'vue'

import type { GfiPluginOptions } from '../types'

export function useMultiSelection(options: {
	map: Map
	mode: GfiPluginOptions['multiSelect']
}) {
	const { map, mode } = options

	const drawOptions: DrawOptions = {
		stopClick: true,
		type: 'Circle',
		style: new Style({
			stroke: new Stroke({ color: 'white', width: 1.5 }),
			fill: new Fill({ color: [255, 255, 255, 0.75] }),
		}),
		freehandCondition: (event) => {
			if (event.type === 'pointermove') {
				return false
			} else if (event.type === 'pointerup') {
				return true
			}
			return platformModifierKeyOnly(event)
		},
		condition: () => false,
	}

	if (mode === 'box') {
		drawOptions.geometryFunction = createBox()
	} else {
		delete drawOptions.geometryFunction
	}

	const selection = ref<[number, number, number, number] | null>(null)

	const draw = new Draw(drawOptions)
	draw.on(
		'drawend',
		(e) =>
			(selection.value =
				(e.feature.getGeometry()?.getExtent() as
					| [number, number, number, number]
					| undefined) ?? null)
	)

	map.addInteraction(draw)
	onScopeDispose(() => {
		map.removeInteraction(draw)
	})

	return {
		selection,
	}
}
