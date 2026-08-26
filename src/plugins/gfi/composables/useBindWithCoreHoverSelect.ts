import type { Feature } from 'ol'
import type { ShallowRef } from 'vue'

import ClusterSource from 'ol/source/Cluster'
import { markRaw, watch } from 'vue'

import { useCoreStore } from '@/core/stores'
import { findLayer } from '@/lib/findLayer'
import getCluster from '@/lib/getCluster'

import { useGfiMainStore } from '../stores/main'
import { filterSelectableFeatures } from '../utils/filterSelectableFeatures'

type CoreFeature = Feature | null
type GfiFeature = Record<string, Feature[]>

function assignCoreToGfi(target: ShallowRef<GfiFeature>, feature: CoreFeature) {
	const gfiMainStore = useGfiMainStore()

	if (feature === null) {
		target.value = markRaw({})
		return
	}

	const layerId = feature.get('_polarLayerId')
	const newFeatures = filterSelectableFeatures(
		feature.get('features') || [feature],
		gfiMainStore.getLayerConfiguration(layerId)?.isSelectable
	)
	target.value = markRaw({
		...(newFeatures.length ? { [layerId]: markRaw(newFeatures) } : {}),
	})
}

function assignGfiToCore(
	target: ShallowRef<CoreFeature>,
	featureMap: GfiFeature
) {
	const coreStore = useCoreStore()

	const features = Object.entries(featureMap).flatMap(([layerId, features]) =>
		features.map((feature) => ({ layerId, feature }))
	)

	// The second condition is necessary for TypeScript checks.
	if (features.length <= 0 || !features[0]) {
		target.value = null
		return
	}

	const targetFeature = target.value
	const targetLayerId = targetFeature?.get('_polarLayerId')
	const targetClusterFeatures =
		targetFeature?.get('features') || (targetFeature ? [targetFeature] : [])
	if (
		targetLayerId === features[0].layerId &&
		targetClusterFeatures.length === features.length &&
		features.every(({ feature }) => targetClusterFeatures.includes(feature))
	) {
		return
	}

	const { feature, layerId } = features[0]
	feature.set('_polarLayerId', layerId, true)
	target.value = markRaw(
		findLayer(coreStore.map, layerId)?.getSource() instanceof ClusterSource
			? getCluster(coreStore.map, feature, '_polarLayerId')
			: feature
	)
}

export function useBindWithCoreHoverSelect(
	hoveredFeatures: ShallowRef<Record<string, Feature[]>>,
	selectedFeatures: ShallowRef<Record<string, Feature[]>>,
	coreHoveredFeature: ShallowRef<Feature | null>,
	coreSelectedFeature: ShallowRef<Feature | null>
) {
	watch(
		coreHoveredFeature,
		(feature) => {
			assignCoreToGfi(hoveredFeatures, feature)
		},
		{ immediate: true }
	)

	watch(
		coreSelectedFeature,
		(feature) => {
			assignCoreToGfi(selectedFeatures, feature)
		},
		{ immediate: true }
	)

	watch(
		hoveredFeatures,
		(featureMap) => {
			assignGfiToCore(coreHoveredFeature, featureMap)
		},
		{ immediate: true }
	)

	watch(
		selectedFeatures,
		(featureMap) => {
			assignGfiToCore(coreSelectedFeature, featureMap)
		},
		{ immediate: true }
	)
}
