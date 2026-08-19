import type { Map } from 'ol'
import type Interaction from 'ol/interaction/Interaction'
import type VectorSource from 'ol/source/Vector'
import type Style from 'ol/style/Style'
import type { Ref } from 'vue'
import type {
	DrawMode,
	DrawPluginOptions,
	DrawTextStyle,
	InteractionOptions,
	MeasureMode,
} from '../../types'

import { Draw, Snap } from 'ol/interaction'

import { createMeasureStyle } from '../createMeasureStyle'
import { createTextStyle } from '../createTextStyle'
import { getSnaps } from './getSnaps'

function createTextDraw(
	textInput: string,
	textSize: number,
	drawSource: VectorSource,
	textStyleOptions: DrawTextStyle
) {
	const textStyle = createTextStyle(textInput, textStyleOptions, textSize)
	const draw = new Draw({
		source: drawSource,
		type: 'Point',
		style: textStyle,
	})
	draw.on('drawend', function (e) {
		e.feature.setStyle(textStyle)
		e.feature.set('text', textInput)
	})
	// prevent the creation of empty text features
	drawSource.on('addfeature', (event) => {
		if (event.feature?.get('text') && !event.feature.get('text').trim()) {
			drawSource.removeFeature(event.feature)
		}
	})

	return draw
}

export function createDrawInteraction(
	configuration: DrawPluginOptions['layers'][number],
	drawMode: DrawMode,
	measureMode: MeasureMode,
	drawSource: VectorSource,
	map: Map,
	text: InteractionOptions['text'],
	drawing: Ref<boolean>,
	baseStyle?: Style
): Interaction[] {
	if (
		drawMode === 'Text' &&
		(typeof text === 'undefined' || !text.textInput.trim())
	) {
		return []
	}

	const makeMeasurement =
		measureMode !== 'none' &&
		(drawMode.includes('Polygon') || drawMode.includes('LineString'))

	const style = makeMeasurement
		? createMeasureStyle(
				measureMode,
				map.getView().getProjection(),
				baseStyle,
				configuration.measureStyle
			)
		: baseStyle

	const draw =
		drawMode === 'Text'
			? createTextDraw(
					text.textInput,
					text.textSize,
					drawSource,
					text.textStyle
				)
			: new Draw({
					source: drawSource,
					type: drawMode,
					style,
				})

	draw.on('drawstart', () => {
		drawing.value = true
	})

	draw.on('drawend', () => {
		drawing.value = false
	})

	draw.on('drawabort', () => {
		drawing.value = false
	})

	if (makeMeasurement) {
		draw.on('drawend', (e) => {
			e.feature.setStyle(style)
		})
	}

	return [
		draw,
		...getSnaps(map, configuration.snapTo ?? []),
		new Snap({ source: drawSource }),
	]
}
