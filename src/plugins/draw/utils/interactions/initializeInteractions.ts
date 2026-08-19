import type Interaction from 'ol/interaction/Interaction'
import type VectorLayer from 'ol/layer/Vector'
import type Map from 'ol/Map'
import type Style from 'ol/style/Style'
import type {
	DrawMode,
	DrawPluginOptions,
	EditMode,
	InteractionOptions,
	ToolMode,
} from '../../types'

import createDeleteInteractions from './createDeleteInteractions'
import { createDrawInteraction } from './createDrawInteractions'
import { createEditInteractions } from './createEditInteractions'

export function initializeInteractions(
	map: Map,
	configuration: DrawPluginOptions,
	drawLayer: VectorLayer,
	tool: ToolMode,
	entry: string | undefined,
	{
		selectedFeature,
		measureMode,
		text,
		activeLassoIds,
		drawing,
	}: InteractionOptions
) {
	const drawSource = drawLayer.getSource()
	const drawLayerId = drawLayer.get('id')

	if (!drawSource) {
		throw new Error('No draw layer or source available.')
	}

	let interactions: Interaction[] = []

	if (tool === 'draw') {
		interactions = createDrawInteraction(
			configuration.layers.find((l) => l.id === drawLayerId) ?? {},
			entry as DrawMode,
			measureMode ?? 'none',
			drawSource,
			map,
			text,
			drawing,
			drawLayer.getStyle() as Style | undefined
		)
	} else if (tool === 'edit') {
		interactions = createEditInteractions(
			configuration.layers.find((l) => l.id === drawLayerId) ?? {},
			entry as EditMode,
			drawLayer,
			drawSource,
			map,
			activeLassoIds,
			selectedFeature
		)
	} else /* assume (tool === 'delete') */ {
		interactions = createDeleteInteractions(map, drawLayer, drawSource)
	}

	interactions.forEach((interaction) => {
		map.addInteraction(interaction)
	})

	return interactions
}
