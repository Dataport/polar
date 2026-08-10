import type { Map } from 'ol'
import type VectorSource from 'ol/source/Vector'

import VectorLayer from 'ol/layer/Vector'
import { Stroke, Style } from 'ol/style'
import { onScopeDispose } from 'vue'

export function useRouteLayer(map: Map, routeSource: VectorSource) {
	const layer = new VectorLayer({
		source: routeSource,
		style: new Style({
			stroke: new Stroke({ color: 'blue', width: 6 }),
		}),
	})

	map.addLayer(layer)
	onScopeDispose(() => {
		map.removeLayer(layer)
	})
}
