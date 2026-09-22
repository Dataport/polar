import type { Map } from 'ol'
import type { Coordinate } from 'ol/coordinate'
import type VectorSource from 'ol/source/Vector'
import type { Ref } from 'vue'

import { Feature } from 'ol'
import { Point } from 'ol/geom'
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
}
