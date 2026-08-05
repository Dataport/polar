import type { Map } from 'ol'
import type VectorSource from 'ol/source/Vector'

import VectorLayer from 'ol/layer/Vector'
import { Circle, Fill, Stroke, Style } from 'ol/style'
import { onScopeDispose } from 'vue'

export function useMarkerLayer(map: Map, markerSource: VectorSource) {
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
}
