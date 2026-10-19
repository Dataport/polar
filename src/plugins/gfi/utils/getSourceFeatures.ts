import type { Map } from 'ol'
import type VectorSource from 'ol/source/Vector'

export function getSourceFeatures(
	map: Map,
	source: VectorSource,
	mode: 'visible' | 'loaded'
) {
	if (mode === 'loaded') {
		return source.getFeatures()
	}

	return source.getFeaturesInExtent(
		map.getView().calculateExtent(map.getSize()),
		map.getView().getProjection()
	)
}
