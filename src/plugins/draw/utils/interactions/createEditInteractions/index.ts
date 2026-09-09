import type { Map } from 'ol'
import type { Feature as OlFeature } from 'ol'
import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'
import type { Ref } from 'vue'
import type {
	DisposableInteraction,
	DrawPluginOptions,
	EditMode,
} from '../../../types'

import { Select, Snap } from 'ol/interaction'
import Style from 'ol/style/Style'

import { getSnaps } from '../getSnaps'
import { createCutInteractions } from './createCutInteractions'
import { createDuplicateInteraction } from './createDuplicateInteraction'
import { createLassoInteraction } from './createLassoInteraction'
import { createMergeInteraction } from './createMergeInteraction'
import { createModifyInteraction } from './createModifyInteraction'
import { createTranslateInteraction } from './createTranslateInteraction'

const makeModifySelect = (
	drawLayer: VectorLayer,
	drawSource: VectorSource,
	selectedFeature: Ref<OlFeature | null>
) => {
	const select = new Select({
		layers: [drawLayer],
		style: null,
		hitTolerance: 50,
	})
	let lastSelectedFeature: OlFeature | null = null
	select.on('select', (event) => {
		const selected = event.selected[event.selected.length - 1] ?? null
		if (selected) {
			lastSelectedFeature = selected
			selectedFeature.value = selected
		} else {
			// empty text features are considered deleted
			if (lastSelectedFeature) {
				const style = lastSelectedFeature.getStyle()
				if (style instanceof Style && style.getText()?.getText() === '') {
					drawSource.removeFeature(lastSelectedFeature)
				}
			}
			selectedFeature.value = null
		}
	})
	return select
}

export function createEditInteractions(
	configuration: DrawPluginOptions['layers'][number],
	drawMode: EditMode,
	drawLayer: VectorLayer,
	drawSource: VectorSource,
	map: Map,
	activeLassoIds: string[] = [],
	selectedFeature: Ref<OlFeature | null>
): DisposableInteraction[] {
	const snaps = [
		...getSnaps(map, configuration.snapTo ?? []),
		{ interaction: new Snap({ source: drawSource }) },
	]
	switch (drawMode) {
		case 'modify':
			return [
				createModifyInteraction(map, drawLayer),
				...snaps,
				{
					interaction: makeModifySelect(drawLayer, drawSource, selectedFeature),
				},
			]
		case 'translate':
			return [createTranslateInteraction(map, drawLayer), ...snaps]
		case 'duplicate':
			return [createDuplicateInteraction(map, { drawSource, drawLayer })]
		case 'cut':
			return [{ interaction: createCutInteractions(map, drawSource) }]
		case 'merge':
			return [{ interaction: createMergeInteraction(drawSource) }, ...snaps]
		case 'lasso':
			return [
				{
					interaction: createLassoInteraction(map, drawSource, activeLassoIds),
				},
			]
		default:
			return []
	}
}
