import type { Feature, Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'

import { Collection } from 'ol'
import { Translate } from 'ol/interaction'

import { makeLocalSelector } from '../localSelector'

export const createTranslateInteraction = (
	map: Map,
	drawLayer: VectorLayer
) => {
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
	// @ts-expect-error | "un on removal" riding piggyback as _onRemove
	translate._onRemove = () => {
		map.un('pointermove', localSelector)
	}

	return translate
}
