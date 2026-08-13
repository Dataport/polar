import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import type { Ref } from 'vue'

import { Feature } from 'ol'
import { Point } from 'ol/geom'
import Modify from 'ol/interaction/Modify'
import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { onScopeDispose, watch } from 'vue'

export function useMarkerLayer(
	map: Map,
	markerSource: VectorSource,
	route: Ref<Coordinate[]>
) {
	const layer = new VectorLayer({
		source: markerSource,
		style: new Style({
			image: new Circle({
				radius: 6,
				fill: new Fill({ color: '#1E90FF' }),
				stroke: new Stroke({ color: 'white', width: 2 }),
			}),
		}),
	})

	map.addLayer(layer)
	onScopeDispose(() => {
		map.removeLayer(layer)
	})

	watch(route, () => {
		markerSource.clear()
		route.value.forEach((coordinate) => {
			if (coordinate.length) {
				markerSource.addFeature(
					new Feature({
						geometry: new Point(coordinate),
					})
				)
			}
		})
	})

	const modify = new Modify({ source: markerSource })
	modify.on('modifyend', (evt) => {
		const allFeatures = markerSource.getFeatures()
		evt.features.forEach((feature) => {
			const geometry = feature.getGeometry()
			if (geometry instanceof Point) {
				const index = allFeatures.indexOf(feature)
				if (index !== -1 && index < route.value.length) {
					route.value[index] = geometry.getCoordinates()
				}
			}
		})
	})

	map.on('pointermove', function (evt) {
		const pixel = map.getEventPixel(evt.originalEvent)
		const hit = map.hasFeatureAtPixel(pixel)
		if (
			'buttons' in evt.originalEvent &&
			(evt.originalEvent as PointerEvent).buttons === 1 &&
			hit
		) {
			map.getTargetElement().style.cursor = 'grabbing'
		} else {
			map.getTargetElement().style.cursor = hit ? 'grab' : ''
		}
	})

	map.addInteraction(modify)
}
