import type { Feature, Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'
import type { DisposableInteraction } from '../../../types'

import { Collection } from 'ol'
import { Translate } from 'ol/interaction'

import { makeLocalSelector } from '../localSelector'

export function createTranslateInteraction(
	map: Map,
	drawLayer: VectorLayer
): DisposableInteraction {
	const activeContainer = { active: false }
	const features: Collection<Feature> = new Collection()
	const translate = new Translate({ features })
	translate.set('_isPolarDragLikeInteraction', true, true)
	translate.on('translatestart', () => {
		activeContainer.active = true
	})
	translate.on('translateend', () => {
		activeContainer.active = false
	})

	const localSelector = makeLocalSelector(
		map,
		activeContainer,
		features,
		drawLayer
	)
	map.on('pointermove', localSelector)

	return {
		interaction: translate,
		dispose: () => {
			map.un('pointermove', localSelector)
		},
	}
}
