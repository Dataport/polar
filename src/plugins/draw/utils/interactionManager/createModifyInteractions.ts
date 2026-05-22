import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'

import { Collection, Feature, Map } from 'ol'
import { Modify, Select, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'

import type { DrawPluginOptions, EditMode } from '../../types'

import { getSnaps } from './getSnaps.ts'
import { makeLocalSelector } from './localSelector.ts'

const createModify = (map: Map, drawLayer: VectorLayer) => {
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

// TODO: at least translate doesn't work (separate method in old model)
export function createModifyInteractions(
	configuration: DrawPluginOptions['layers'][number],
	drawMode: EditMode,
	drawLayer: VectorLayer,
	drawSource: VectorSource,
	map: Map
): Interaction[] {
	switch (drawMode) {
		case 'modify':
			// TODO: move modify logic here, change to "createEditInteractions"
			// return createModify(map, drawLayer)
			break
		case 'translate':
		case 'duplicate':
		case 'cutPolygon':
		case 'cutMultiPolygon':
		case 'cutLine':
		case 'cutMultiLine':
	}
	// clear input - no feature selected initially
	// TODO: if text features are supported and in editable scope, the input field must be prepared (disabled and empty while no text is chosen)
	// TODO: commit('setTextInput', '')
	const select = new Select({
		layers: [drawLayer],
		style: null,
		hitTolerance: 50,
	})
	let lastSelectedFeature
	select.on('select', (event) => {
		if (event.selected.length > 0) {
			lastSelectedFeature = event.selected[event.selected.length - 1]
			// commit('setSelectedFeature', lastSelectedFeature)
			const featureStyle = lastSelectedFeature.getStyle()

			/*
			dispatch(
				featureStyle && 'getText' in featureStyle && featureStyle.getText()
					? 'modifyTextStyle'
					: 'modifyDrawStyle',
				featureStyle
			)
				*/
		} else if (event.selected.length === 0) {
			if (lastSelectedFeature && lastSelectedFeature.get('text') === '') {
				drawSource.removeFeature(lastSelectedFeature)
				// commit('updateFeatures')
			}
			// if (drawMode === 'Text') {
			// commit('setTextInput', '')
			// commit('setSelectedFeature', null)
			// }
		}
	})
	return [
		createModify(map, drawLayer),
		...getSnaps(map, configuration.snapTo ?? []),
		new Snap({ source: drawSource }),
		select,
	]
}
