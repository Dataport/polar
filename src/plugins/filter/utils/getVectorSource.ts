import type Layer from 'ol/layer/Layer'
import ClusterSource from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'

/**
 * Retrieves the vector source from a layer using (possibly nested) `.getSource()` calls.
 *
 * @param layer - Layer to get the vector source from
 * @returns Vector source
 */
export function getVectorSource(layer: Layer): VectorSource {
	let source = layer.getSource()
	if (!source) {
		throw new Error('Could not find a vector source for this layer')
	}
	while (source instanceof ClusterSource) {
		source = source.getSource()
		if (!source) {
			throw new Error('Could not find a vector source for this layer')
		}
	}
	if (!(source instanceof VectorSource)) {
		throw new Error('Could not find a vector source for this layer')
	}
	return source
}
