import type { Feature } from 'ol'
import type { ShallowRef } from 'vue'

import { markRaw, watch } from 'vue'

import { useGfiMainStore } from '../stores/main'
import { filterSelectableFeatures } from '../utils/filterSelectableFeatures'

type CoreFeature = Feature | null
type CoreFeatures = Feature[]
type GfiFeature = { layerId: string; feature: Feature } | null
type GfiFeatures = Partial<Record<string, Feature[]>>

function assignCoreToGfiCluster(
	target: ShallowRef<GfiFeatures>,
	features: CoreFeatures,
	referenceOrder?: CoreFeatures
) {
	const gfiMainStore = useGfiMainStore()
	const layerId = features[0]?.get('_polarLayerId')
	const layerConfiguration = gfiMainStore.getLayerConfiguration(layerId)

	if (referenceOrder) {
		features.sort((a, b) => {
			const getIndex = (feature) => referenceOrder.indexOf(feature)
			return getIndex(a) - getIndex(b)
		})
	}

	target.value = markRaw(
		Object.groupBy(
			filterSelectableFeatures(features, layerConfiguration?.isSelectable),
			(feature) => feature.get('_polarLayerId')
		)
	)
}

function assignGfiToCoreFeature(
	target: ShallowRef<CoreFeature>,
	feature: GfiFeature
) {
	if (!feature) {
		target.value = null
		return
	}
	target.value = markRaw(feature.feature)
}

function assignCoreToGfiFeature(
	target: ShallowRef<GfiFeature>,
	feature: CoreFeature
) {
	if (!feature) {
		target.value = null
		return
	}
	target.value = markRaw({
		layerId: feature.get('_polarLayerId'),
		feature,
	})
}

function bindWithWatcher<T, S, E>(
	target: ShallowRef<T>,
	source: ShallowRef<S>,
	handler: (target: ShallowRef<T>, source: S, extra?: E) => void,
	extra?: ShallowRef<E>
) {
	watch(
		source,
		(value) => {
			handler(target, value, extra?.value)
		},
		{
			immediate: true,
		}
	)
}

export function useBindWithCoreHoverSelect(
	hoveredFeature: ShallowRef<GfiFeature>,
	coreHoveredFeature: ShallowRef<CoreFeature>,
	hoveredFeatures: ShallowRef<GfiFeatures>,
	coreHoveredFeatures: ShallowRef<CoreFeatures>,
	selectedFeature: ShallowRef<GfiFeature>,
	coreSelectedFeature: ShallowRef<CoreFeature>,
	selectedFeatures: ShallowRef<GfiFeatures>,
	coreSelectedFeatures: ShallowRef<CoreFeatures>,
	referenceOrder: ShallowRef<Feature[]>
) {
	bindWithWatcher(hoveredFeature, coreHoveredFeature, assignCoreToGfiFeature)
	bindWithWatcher(coreHoveredFeature, hoveredFeature, assignGfiToCoreFeature)
	bindWithWatcher(hoveredFeatures, coreHoveredFeatures, assignCoreToGfiCluster)

	bindWithWatcher(selectedFeature, coreSelectedFeature, assignCoreToGfiFeature)
	bindWithWatcher(coreSelectedFeature, selectedFeature, assignGfiToCoreFeature)
	bindWithWatcher(
		selectedFeatures,
		coreSelectedFeatures,
		assignCoreToGfiCluster,
		referenceOrder
	)
}
