import type { Feature, Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'
import type { DisposableInteraction } from '../../../types'

import { Collection } from 'ol'
import { Modify } from 'ol/interaction'

import { makeLocalSelector } from '../localSelector'

// TODO: doesn't properly work on mobile, difficult/impossible to get the vertices
export function createModifyInteraction(
	map: Map,
	drawLayer: VectorLayer
): DisposableInteraction {
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

	return {
		interaction: modify,
		dispose: () => {
			map.un('pointermove', localSelector)
		},
	}
}
