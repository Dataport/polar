import type { Map } from 'ol'
import type Interaction from 'ol/interaction/Interaction'
import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'

import { platformModifierKeyOnly } from 'ol/events/condition'
import { DragBox, Select } from 'ol/interaction'

const pointerStyle = (map: Map, drawLayer: VectorLayer) => (e) => {
	const found = map.hasFeatureAtPixel(e.pixel, {
		layerFilter: (l) => l === drawLayer,
	})

	map.getTargetElement().style.cursor = found ? 'pointer' : ''
}

export default function (
	map: Map,
	drawLayer: VectorLayer,
	drawSource: VectorSource
): Interaction[] {
	const selectInteraction = new Select({ layers: [drawLayer] })
	const selectedFeatures = selectInteraction.getFeatures()
	const dragBoxInteraction = new DragBox({
		condition: platformModifierKeyOnly,
	})

	const boundPointerStyle = pointerStyle(map, drawLayer)
	map.on('pointermove', boundPointerStyle)

	dragBoxInteraction.on('boxend', () => {
		const extent = dragBoxInteraction.getGeometry().getExtent()
		selectedFeatures.extend(
			drawSource
				.getFeaturesInExtent(extent)
				.filter((feature) => feature.getGeometry()?.intersectsExtent(extent))
		)
	})

	selectedFeatures.on(['add'], () => {
		selectedFeatures.forEach((feature) => {
			drawSource.removeFeature(feature)
		})
		selectedFeatures.clear()
	})

	// @ts-expect-error | local piggyback
	selectInteraction._onRemove = () => {
		map.un('pointermove', boundPointerStyle)
		map.getTargetElement().style = ''
	}

	return [selectInteraction, dragBoxInteraction]
}
