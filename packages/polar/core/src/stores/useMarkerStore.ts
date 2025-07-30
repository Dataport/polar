import merge from 'lodash.merge'
import { Feature, MapBrowserEvent } from 'ol'
import { createEmpty, extend } from 'ol/extent'
import { Point } from 'ol/geom'
import type BaseLayer from 'ol/layer/Base'
import VectorLayer from 'ol/layer/Vector'
import RenderFeature from 'ol/render/Feature'
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import getCluster from '../../../lib/getCluster'
import { isVisible } from '../../../lib/invisibleStyle'
import {
	CallOnMapSelect,
	MarkerConfiguration,
	MarkerLayer,
	MarkerStyle,
} from '../types'
import { getMarkerStyle } from '../utils/markers'
import { useCoreStore } from './useCoreStore'

export const useMarkerStore = defineStore('markers', () => {
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

	let layers: MarkerLayer[] = []
	let callOnMapSelect: CallOnMapSelect | null = null
	let clusterClickZoom: MarkerConfiguration['clusterClickZoom'] = false

	let lastZoom = 0

	// NOTE: This needs to be doubled to be able to compare OpenLayers objects
	// and have reactivity to watch for changes.
	let hoveredValue: Feature | null = null
	let selectedValue: Feature | null = null
	const hovered = ref<Feature | null>(null)
	const selected = ref<Feature | null>(null)

	const selectedCoordinates = computed(() =>
		selected.value === null
			? null
			: (selected.value.getGeometry() as Point).getCoordinates()
	)

	// As this function is only internally used, it is expected that a layer is found.
	function getLayerConfiguration(id: string) {
		return layers.find((layer) => layer.id === id) as MarkerLayer
	}

	function layerFilter(layer: BaseLayer) {
		return layers.some(({ id }) => id === (layer.get('id') as string))
	}

	function findLayer(layerId: string) {
		return useCoreStore()
			.getMap()
			.getLayers()
			.getArray()
			.find((layer) => layer.get('id') === layerId) as VectorLayer | undefined
	}

	function resolveClusterClick(feature: Feature) {
		const features = feature.get('features') as Feature[]

		const extent = createEmpty()
		features.forEach((feature) =>
			extend(extent, feature.getGeometry()?.getExtent() || [])
		)

		useCoreStore()
			.getMap()
			.getView()
			.fit(extent, {
				duration: 400,
				padding: [80, 30, 80, 30],
			})
	}

	function updateSelection(feature: Feature | null, centerOnFeature = false) {
		const coreStore = useCoreStore()

		selectedValue?.setStyle(undefined)
		selected.value?.setStyle(undefined)
		selectedValue = null
		selected.value = null

		if (feature === null) {
			return
		}

		const layerId = feature.get('_polarLayerId') as string
		const selectedCluster =
			// @ts-expect-error | Found layers always have a source and getDistance is defined on cluster sources.
			typeof findLayer(layerId)?.getSource().getDistance === 'function'
				? getCluster(coreStore.getMap(), feature, '_polarLayerId')
				: feature

		selectedCluster.setStyle(
			getMarkerStyle(
				getLayerConfiguration(feature.get('_polarLayerId') as string)
					.selectionStyle,
				selectedCluster.get('features')?.length > 1
			)
		)

		selectedValue = selectedCluster
		selected.value = selectedCluster
		if (centerOnFeature) {
			coreStore.centerOnFeature(selectedValue)
		}
	}

	function setLayerId(feature: Feature) {
		if (feature.get('_polarLayerId')) {
			return
		}

		const layerId = useCoreStore()
			.getMap()
			.getLayers()
			.getArray()
			.find((layer) => {
				if (layer instanceof VectorLayer) {
					let step: VectorLayer | VectorSource | Cluster = layer
					while (step instanceof VectorLayer || step instanceof Cluster) {
						// @ts-expect-error | Clusters in masterportalapi always have a source.
						step = step.getSource()
						// @ts-expect-error | It's not a vector layer anymore.
						if (step.hasFeature(feature)) {
							return true
						}
					}
					return Boolean(step.hasFeature(feature))
				}
				return false
			})
			?.get('id') as string | undefined
		if (layerId) {
			feature.set('_polarLayerId', layerId, true)
		}
	}

	function setupMarkers(configuration: MarkerConfiguration) {
		const map = useCoreStore().getMap()

		layers = configuration.layers.map(
			(layer) =>
				merge(
					{
						defaultStyle,
						hoverStyle,
						selectionStyle,
						unselectableStyle,
						isSelectable: () => true,
					},
					layer
				) as MarkerLayer
		)
		callOnMapSelect =
			typeof configuration.callOnMapSelect === 'function'
				? configuration.callOnMapSelect
				: callOnMapSelect
		clusterClickZoom =
			typeof configuration.clusterClickZoom === 'boolean'
				? configuration.clusterClickZoom
				: clusterClickZoom

		lastZoom = map.getView().getZoom() as number

		map
			.getLayers()
			.getArray()
			.filter(layerFilter)
			.forEach((layer) => {
				// only vector layers reach this
				const source = (layer as VectorLayer).getSource()
				if (source !== null) {
					// @ts-expect-error | Undocumented hook.
					source.geometryFunction =
						// prevents features from jumping due to invisible features "pulling"
						(feature: Feature) =>
							isVisible(feature) ? feature.getGeometry() : null
				}
				const layerConfiguration = getLayerConfiguration(
					layer.get('id') as string
				)
				;(layer as VectorLayer).setStyle((feature) =>
					getMarkerStyle(
						layerConfiguration.isSelectable(feature as Feature)
							? layerConfiguration.defaultStyle
							: layerConfiguration.unselectableStyle,
						feature.get('features')?.length > 1
					)
				)
			})

		// // // STORE EVENT HANDLING

		watch(hovered, (feature) => {
			if (hoveredValue !== null && hoveredValue !== selectedValue) {
				hoveredValue.setStyle(undefined)
				hovered.value?.setStyle(undefined)
				hoveredValue = null
				hovered.value = null
			}
			if (feature !== null && feature !== selectedValue) {
				hoveredValue = feature
				hovered.value = feature
				const isMultiFeature = hoveredValue.get('features')?.length > 1
				const style = getMarkerStyle(
					getLayerConfiguration(feature.get('_polarLayerId') as string)
						.hoverStyle,
					isMultiFeature
				)
				hoveredValue.setStyle(style)
				hovered.value.setStyle(style)
			}
		})

		map.on('moveend', mapMoveEnd)
		map.on('pointermove', mapPointerMove)
		map.on('click', mapClick)
		/*
		 * click leads to singlelick; if an element is selected,
		 * to not let other plugins pick it up, something was already done with it
		 */
		map.on('singleclick', mapSingleClick)
	}

	// // // MAP EVENT HANDLING

	let lastClickEvent: MapBrowserEvent<MouseEvent | TouchEvent> | null = null

	function mapMoveEnd() {
		const zoom = useCoreStore().getMap().getView().getZoom() as number
		if (zoom !== lastZoom) {
			lastZoom = zoom
			if (selectedValue) {
				const baseFeature = (selectedValue.get('features')?.[0] ||
					selectedValue) as Feature
				setLayerId(baseFeature)
				updateSelection(baseFeature)
			}
		}
	}

	function mapPointerMove(event: MapBrowserEvent<MouseEvent>) {
		const feature = useCoreStore().getMap().getFeaturesAtPixel(event.pixel, {
			layerFilter,
		})[0]

		if (feature === selectedValue || feature instanceof RenderFeature) {
			return
		}
		if (hoveredValue !== null && hoveredValue !== selectedValue) {
			hoveredValue.setStyle(undefined)
			hovered.value?.setStyle(undefined)
			hoveredValue = null
			hovered.value = null
		}
		// NOTE: Not all pixels include features.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!feature) {
			return
		}
		setLayerId(feature)
		const layerConfiguration = getLayerConfiguration(
			feature.get('_polarLayerId') as string
		)
		if (!layerConfiguration.isSelectable(feature)) {
			return
		}
		const isMultiFeature = feature.get('features')?.length > 1
		feature.setStyle(
			getMarkerStyle(layerConfiguration.hoverStyle, isMultiFeature)
		)
		hoveredValue = feature
		hovered.value = feature
	}

	function mapClick(event: MapBrowserEvent<MouseEvent | TouchEvent>) {
		const coreStore = useCoreStore()
		const map = coreStore.getMap()
		if (selectedValue !== null) {
			updateSelection(null)
		}
		const feature = map.getFeaturesAtPixel(event.pixel, { layerFilter })[0]

		if (
			// NOTE: Not all pixels include features.
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			!feature ||
			feature instanceof RenderFeature
		) {
			return
		}
		setLayerId(feature)
		const layerConfiguration = getLayerConfiguration(
			feature.get('_polarLayerId') as string
		)
		if (!layerConfiguration.isSelectable(feature)) {
			return
		}

		const isMultiFeature = feature.get('features')?.length > 1
		lastClickEvent = event
		event.stopPropagation()

		const isMaxZoom = map.getView().getZoom() !== map.getView().getMaxZoom()
		if (clusterClickZoom && isMultiFeature && isMaxZoom) {
			resolveClusterClick(feature)
			return
		}

		hoveredValue?.setStyle(undefined)
		hovered.value?.setStyle(undefined)
		hoveredValue = null
		hovered.value = null
		updateSelection(feature, true)

		if (callOnMapSelect) {
			const { action, payload, pluginName } = callOnMapSelect
			if (!pluginName) {
				coreStore[action](payload)
				return
			}

			const plugin = coreStore.plugins.find(({ name }) => name === pluginName)
			if (!plugin) {
				console.error(
					`@polar/core:callOnMapSelect: Plugin ${pluginName} does not exist or is not configured. Action ${action} could not be called.`
				)
				return
			}
			const pluginStore = plugin.storeModule?.()
			if (!pluginStore) {
				console.error(
					`@polar/core:callOnMapSelect: Plugin ${pluginName} does not have a store module. Action ${action} could not be called.`
				)
				return
			}
			pluginStore[action](payload)
		}
	}

	function mapSingleClick(event: MapBrowserEvent<MouseEvent | TouchEvent>) {
		if (event.originalEvent === lastClickEvent?.originalEvent) {
			event.stopPropagation()
		}
	}

	return {
		setupMarkers,
		hovered,
		selected,
		selectedCoordinates,
	}
})
