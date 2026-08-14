import type { Map } from 'ol'
import type VectorLayer from 'ol/layer/Vector'
import type VectorSource from 'ol/source/Vector'

import { Select } from 'ol/interaction'

const pointerStyle = (map: Map, drawLayer: VectorLayer) => (e) => {
	const found = map.hasFeatureAtPixel(e.pixel, {
		layerFilter: (l) => l === drawLayer,
	})

	map.getTargetElement().style.cursor = found ? 'copy' : ''
}

export function createDuplicateInteraction(
	map: Map,
	{
		drawSource,
		drawLayer,
	}: {
		drawSource: VectorSource
		drawLayer: VectorLayer
	}
) {
	const selectInteraction = new Select({ layers: [drawLayer], style: null })
	const selectedFeatures = selectInteraction.getFeatures()

	const boundPointerStyle = pointerStyle(map, drawLayer)
	map.on('pointermove', boundPointerStyle)

	selectedFeatures.on('add', () => {
		// @ts-expect-error | We know there's a feature. It's why we're here.
		drawSource.addFeature(selectedFeatures.getArray()[0].clone())
		selectedFeatures.clear()
	})

	// @ts-expect-error | local piggyback
	selectInteraction._onRemove = () => {
		map.un('pointermove', boundPointerStyle)
		map.getTargetElement().style = ''
	}

	return selectInteraction
}
