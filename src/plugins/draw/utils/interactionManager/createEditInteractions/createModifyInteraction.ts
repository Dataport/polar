import type { Feature, Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'

import { Collection } from 'ol'
import { Modify } from 'ol/interaction'

import { makeLocalSelector } from '../localSelector'

// TODO: doesn't properly work on mobile, difficult/impossible to get the vertices
export const createModifyInteraction = (map: Map, drawLayer: VectorLayer) => {
	const activeContainer = { active: false }
	const features: Collection<Feature> = new Collection()
	const modify = new Modify({ features })
	modify.set('_isPolarDragLikeInteraction', true, true)
	modify.on('modifystart', () => {
		activeContainer.active = true
	})
	modify.on('modifyend', () => {
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
	modify._onRemove = () => {
		map.un('pointermove', localSelector)
	}

	return modify
}
