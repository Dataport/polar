import type { Map } from 'ol'
import type VectorSource from 'ol/source/Vector'

import { Draw, Snap } from 'ol/interaction'
import Interaction from 'ol/interaction/Interaction'

import type { DrawMode, DrawPluginOptions } from '../../types'

import createDrawStyle from '../../utils/createDrawStyle'
import { getSnaps } from './getSnaps'

export function createDrawInteraction(
	configuration: DrawPluginOptions['layers'][number],
	drawMode: DrawMode,
	drawSource: VectorSource,
	map: Map
): Interaction[] {
	if (drawMode === 'Text') {
		/* TODO:
		return dispatch('createTextInteractions', {
			textInput,
			textSize,
			drawSource,
			drawConfiguration: configuration,
		})
			*/
		return []
	}

	/*
	const style = createDrawStyle(
		drawMode,
		selectedStrokeColor,
		measureMode,
		rootGetters.map.getView().getProjection(),
		configuration?.style
	)
		*/
	const draw = new Draw({
		source: drawSource,
		type: drawMode,
		// style,
	})
	// @ts-expect-error | internal hack to detect it in other plugins
	draw._isDrawPlugin = true

	/*
	draw.on('drawend', (e) => {
		e.feature.setStyle(style)
	})
		*/
	return [
		draw,
		...getSnaps(map, configuration.snapTo ?? []),
		new Snap({ source: drawSource }),
	]
}
