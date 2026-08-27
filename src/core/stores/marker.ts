import type { Feature, MapBrowserEvent } from 'ol'
import type { EventsKey } from 'ol/events'
import type BaseLayer from 'ol/layer/Base'
import type VectorLayer from 'ol/layer/Vector'
import type { Style } from 'ol/style'
import type {
	MarkerLayer,
	MarkerLayerConfiguration,
	MarkerStyle,
} from '../types'

import { toMerged } from 'es-toolkit'
import { unByKey } from 'ol/Observable'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import { isVisible } from '@/lib/invisibleStyle'

import { useClusterMarker } from '../composables/useClusterMarker'
import { resolveClusterClick } from '../utils/map/resolveClusterClick'
import { getMarkerStyle } from '../utils/markers'
import { useMainStore } from './main'

// these have been measured to fit once and influence marker size
const imgSize: [number, number] = [26, 36]
const imgSizeMulti: [number, number] = [40, 36]

const defaultStroke = '#FFFFFF'
const defaultStrokeWidth = '2'

const defaultStyle: MarkerStyle = {
	clusterSize: imgSizeMulti,
	fill: '#005CA9',
	size: imgSize,
	stroke: defaultStroke,
	strokeWidth: defaultStrokeWidth,
}
const hoverStyle: MarkerStyle = {
	clusterSize: imgSizeMulti,
	fill: '#7B1045',
	size: imgSize,
	stroke: defaultStroke,
	strokeWidth: defaultStrokeWidth,
}
const selectionStyle: MarkerStyle = {
	clusterSize: imgSizeMulti,
	fill: '#679100',
	size: imgSize,
	stroke: defaultStroke,
	strokeWidth: defaultStrokeWidth,
}
const unselectableStyle: MarkerStyle = {
	clusterSize: imgSizeMulti,
	fill: '#333333',
	size: imgSize,
	stroke: defaultStroke,
	strokeWidth: defaultStrokeWidth,
}

const layerDefaults = {
	defaultStyle,
	hoverStyle,
	selectionStyle,
	unselectableStyle,
	isSelectable: () => true,
} satisfies Partial<MarkerLayerConfiguration>

export const useMarkerStore = defineStore('marker', () => {
	const mainStore = useMainStore()
	const configuration = computed(() => mainStore.configuration.markers)

	const layers = computed(() =>
		Object.fromEntries(
			configuration.value?.layers
				.map((layer) => toMerged(layerDefaults, layer))
				.map((layer) => [layer.id, layer as MarkerLayer]) ?? []
		)
	)

	function getLayerConfiguration(id: string) {
		return layers.value[id] as MarkerLayer
	}

	function layerFilter(layer: BaseLayer) {
		return Object.hasOwn(layers.value, layer.get('id'))
	}

	function getStyle(
		feature: Feature,
		layerId: string,
		hovered: boolean,
		selected: boolean
	): Style {
		const layerConfiguration = getLayerConfiguration(layerId)
		const clusterFeatures = feature.get('features') || [feature]
		return getMarkerStyle(
			clusterFeatures.some(layerConfiguration.isSelectable)
				? selected
					? layerConfiguration.selectionStyle
					: hovered
						? layerConfiguration.hoverStyle
						: layerConfiguration.defaultStyle
				: layerConfiguration.unselectableStyle,
			feature.get('features')?.length > 1
		)
	}

	const selectedFeature = shallowRef<Feature | null>(null)
	const {
		cluster: selectedCluster,
		clusterFeatures: selectedClusterFeatures,
		clusterCoordinates: selectedCoordinates,
	} = useClusterMarker(selectedFeature, (active, cluster) =>
		getStyle(
			cluster,
			cluster.get('_polarLayerId'),
			cluster === hoveredCluster.value,
			active
		)
	)

	const hoveredFeature = shallowRef<Feature | null>(null)
	const {
		cluster: hoveredCluster,
		clusterFeatures: hoveredClusterFeatures,
		clusterCoordinates: hoveredCoordinates,
	} = useClusterMarker(hoveredFeature, (active, cluster) =>
		getStyle(
			cluster,
			cluster.get('_polarLayerId'),
			active,
			cluster === selectedCluster.value
		)
	)

	function mapPointerMove({ map, pixel }: MapBrowserEvent) {
		const feature = map.getFeaturesAtPixel(pixel, {
			layerFilter,
		})[0] as Feature | null

		if (!feature) {
			hoveredFeature.value = null
			return
		}

		const layerConfiguration = getLayerConfiguration(
			feature.get('_polarLayerId') as string
		)

		const clusterFeatures = feature.get('features') || [feature]
		const selectableClusterFeatures = clusterFeatures.filter(
			layerConfiguration.isSelectable
		)
		if (selectableClusterFeatures.length === 0) {
			return
		}

		hoveredFeature.value = selectableClusterFeatures[0]
	}

	const clusterClickZoom = computed(
		() => (configuration.value?.clusterClickZoom as boolean) || false
	)

	const isMaxZoom = computed(
		() => mainStore.map.getView().getMaxZoom() === mainStore.zoom
	)

	const lastClickEvent = ref<PointerEvent | KeyboardEvent | WheelEvent | null>(
		null
	)

	function mapClick(event: MapBrowserEvent) {
		const { map, pixel } = event
		const feature = map.getFeaturesAtPixel(pixel, {
			layerFilter,
		})[0] as Feature | null

		if (!feature) {
			selectedFeature.value = null
			return
		}

		const layerConfiguration = getLayerConfiguration(
			feature.get('_polarLayerId') as string
		)

		const clusterFeatures = feature.get('features') || [feature]
		const selectableClusterFeatures = clusterFeatures.filter(
			layerConfiguration.isSelectable
		)
		if (selectableClusterFeatures.length === 0) {
			return
		}

		event.stopPropagation()
		lastClickEvent.value = event.originalEvent

		if (
			clusterClickZoom.value &&
			clusterFeatures.length > 1 &&
			!isMaxZoom.value
		) {
			resolveClusterClick(map, feature)
			return
		}

		selectedFeature.value = selectableClusterFeatures[0]
	}

	function mapSingleClick(event: MapBrowserEvent) {
		if (event.originalEvent === lastClickEvent.value) {
			event.stopPropagation()
		}
	}

	const listenerKeys: EventsKey[] = []
	const teardownCallbacks: (() => void)[] = []

	function setup() {
		mainStore.map
			.getLayers()
			.getArray()
			.filter(layerFilter)
			.forEach((layer) => {
				// only vector layers reach this
				const source = (layer as VectorLayer).getSource()
				const stampFeature = (feature: Feature) => {
					feature.set('_polarLayerId', layer.get('id'), true)
					;(feature.get('features') || []).forEach((feature) => {
						feature.set('_polarLayerId', layer.get('id'), true)
					})
				}
				if (source !== null) {
					// @ts-expect-error | Undocumented hook.
					source.geometryFunction =
						// prevents features from jumping due to invisible features "pulling"
						(feature: Feature) =>
							isVisible(feature) ? feature.getGeometry() : null
					teardownCallbacks.push(() => {
						// @ts-expect-error | Undocumented hook.
						source.geometryFunction = undefined
					})
					source.getFeatures().forEach((feature) => {
						stampFeature(feature)
					})
					listenerKeys.push(
						source.on('addfeature', (event) => {
							stampFeature(event.feature)
						})
					)
				}
				;(layer as VectorLayer).setStyle((feature) =>
					getStyle(feature as Feature, layer.get('id'), false, false)
				)
				teardownCallbacks.push(() => {
					;(layer as VectorLayer).setStyle(undefined)
				})
			})

		listenerKeys.push(mainStore.map.on('pointermove', mapPointerMove))
		listenerKeys.push(mainStore.map.on('click', mapClick))
		listenerKeys.push(mainStore.map.on('singleclick', mapSingleClick))
	}
	function teardown() {
		listenerKeys.forEach((key) => {
			unByKey(key)
		})
		teardownCallbacks.forEach((callback) => {
			callback()
		})
	}

	return {
		hoveredFeature,
		hoveredCluster,
		hoveredClusterFeatures,
		hoveredCoordinates,

		selectedFeature,
		selectedCluster,
		selectedClusterFeatures,
		selectedCoordinates,

		setup,
		teardown,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useMarkerStore, import.meta.hot))
}
