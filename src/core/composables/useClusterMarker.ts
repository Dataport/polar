import type { Feature, Map } from 'ol'
import type { Point } from 'ol/geom'
import type { Style } from 'ol/style'
import type { ShallowRef } from 'vue'

import { computed, markRaw, shallowRef, watch } from 'vue'

import { findLayer } from '@/lib/findLayer'
import getCluster from '@/lib/getCluster'

import { useMainStore } from '../stores/main'

function getClusterSafe(map: Map, feature: Feature) {
	const layerId = feature.get('_polarLayerId') as string
	// @ts-expect-error | Found layers always have a source and getDistance is defined on cluster sources.
	return typeof findLayer(map, layerId)?.getSource().getDistance === 'function'
		? getCluster(map, feature, '_polarLayerId')
		: feature
}

export function useClusterMarker(
	feature: ShallowRef<Feature | null>,
	style: (active: boolean, feature: Feature) => Style
) {
	const mainStore = useMainStore()

	const cluster = shallowRef<Feature | null>(null)
	const clusterFeatures = computed(
		() => (cluster.value?.get('features') ?? []) as Feature[]
	)
	const clusterCoordinates = computed(() =>
		cluster.value === null
			? null
			: ((cluster.value.getGeometry() as Point).getCoordinates() as [
					number,
					number,
				])
	)

	function updateCluster(newFeature: Feature | null) {
		const newCluster =
			newFeature === null
				? null
				: markRaw(getClusterSafe(mainStore.map, newFeature))

		if (cluster.value === newCluster) {
			return
		}

		if (cluster.value) {
			cluster.value.setStyle(style(false, cluster.value))
		}

		cluster.value = newCluster

		if (cluster.value) {
			cluster.value.setStyle(style(true, cluster.value))
		}
	}

	watch(feature, updateCluster, { immediate: true })

	watch(
		() => mainStore.zoom,
		() => {
			updateCluster(feature.value)
		}
	)

	return { cluster, clusterFeatures, clusterCoordinates }
}
