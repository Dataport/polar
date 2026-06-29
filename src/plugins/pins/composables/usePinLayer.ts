import type { Coordinate } from 'ol/coordinate'
import type { Style } from 'ol/style'
import type { Ref } from 'vue'

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source'
import { watch } from 'vue'

export function usePinLayer(coordinate: Ref<Coordinate | null>, style: Style) {
	const pinLayer = new VectorLayer({
		source: new Vector(),
		style,
	})

	function addPin(newCoordinate: Coordinate) {
		// Always clean up other/old pin first – single pin only atm.
		removePin()
		;(pinLayer.getSource() as Vector).addFeature(
			new Feature({
				geometry: new Point(newCoordinate),
				type: 'point',
				name: 'mapMarker',
				zIndex: 100,
			})
		)
	}

	function removePin() {
		;(pinLayer.getSource() as Vector).clear()
	}

	watch(
		coordinate,
		(newCoordinate) => {
			if (newCoordinate) {
				addPin(newCoordinate)
			} else {
				removePin()
			}
		},
		{ deep: true, immediate: true }
	)

	return { pinLayer }
}
