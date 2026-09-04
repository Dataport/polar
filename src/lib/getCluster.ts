import type { Map } from 'ol'
import type VectorSource from 'ol/source/Vector'

import { Feature } from 'ol'
import VectorLayer from 'ol/layer/Vector'

import { findLayer } from '@/lib/findLayer'

const clusterByFeature = new WeakMap<Feature, Feature>()

/*
 * Helper function to retrieve the related cluster of a feature.
 * Returns the feature if it's a cluster feature, or the cluster the feature is in.
 */
export default function getCluster(
	map: Map,
	feature: Feature,
	layerId: string
): Feature {
	if (feature.get('features')) {
		return feature
	}

	const layer = findLayer(map, feature.get(layerId))
	if (!(layer instanceof VectorLayer)) {
		throw new Error(
			`@polar/lib-get-cluster: The layer with the id ${layerId} either does not exist or is not a VectorLayer.`
		)
	}

	// If the layer can be found, it has a source
	const source = layer.getSource() as VectorSource
	const cachedCluster = clusterByFeature.get(feature)
	const cluster =
		cachedCluster &&
		source.hasFeature(cachedCluster) &&
		cachedCluster.get('features').includes(feature)
			? cachedCluster
			: source
					.getFeatures()
					.find((candidate: Feature) =>
						candidate.get('features').includes(feature)
					)

	if (!(cluster instanceof Feature)) {
		throw new Error(
			'@polar/lib-get-cluster: No cluster could be found for the given feature.'
		)
	}
	clusterByFeature.set(feature, cluster)
	// The given feature should be the last in the array, as it the one "above" all thus added last
	const clusterFeatures = cluster.get('features') as Feature[]
	if (clusterFeatures.at(-1) !== feature) {
		cluster.set(
			'features',
			[...clusterFeatures.filter((f) => f !== feature), feature],
			true
		)
	}
	// true = silent change (prevents cluster recomputation & rerender)
	cluster.set(layerId, feature.get(layerId), true)
	return cluster
}
