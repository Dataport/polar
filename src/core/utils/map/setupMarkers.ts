import { toMerged } from 'es-toolkit'
import { Feature, Map, MapBrowserEvent, MapEvent } from 'ol'
import { createEmpty, extend } from 'ol/extent'
import type BaseLayer from 'ol/layer/Base'
import VectorLayer from 'ol/layer/Vector'
import RenderFeature from 'ol/render/Feature'
import Cluster from 'ol/source/Cluster'
import VectorSource from 'ol/source/Vector'
import { watch, markRaw, toRaw } from 'vue'
import type { MarkerLayer, MarkerStyle } from '../../types'
import { getMarkerStyle } from '../../utils/markers'
import { useMainStore } from '../../stores/main'
import { isVisible } from '@/lib/invisibleStyle'
import getCluster from '@/lib/getCluster'
import { useMarkerStore } from '@/core/stores/marker'

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

let lastZoom = 0

// As this function is only internally used, it is expected that a layer is found.
function getLayerConfiguration(id: string) {
	return layers.find((layer) => layer.id === id) as MarkerLayer
}

function layerFilter(layer: BaseLayer) {
	return layers.some(({ id }) => id === (layer.get('id') as string))
}

function findLayer(map: Map, layerId: string) {
	return map
		.getLayers()
		.getArray()
		.find((layer) => layer.get('id') === layerId) as VectorLayer | undefined
}

function resolveClusterClick(map: Map, feature: Feature) {
	const features = feature.get('features') as Feature[]

	const extent = createEmpty()
	features.forEach((feature) =>
		extend(extent, feature.getGeometry()?.getExtent() || [])
	)

	map.getView().fit(extent, {
		duration: 400,
		padding: [80, 30, 80, 30],
	})
}

function updateSelection(
	map: Map,
	feature: Feature | null,
	centerOnFeature = false
) {
	const store = useMarkerStore()

	store.selected?.setStyle(undefined)
	store.selected = null

	if (feature === null) {
		return
	}

	const layerId = feature.get('_polarLayerId') as string
	const selectedCluster =
		// @ts-expect-error | Found layers always have a source and getDistance is defined on cluster sources.
		typeof findLayer(map, layerId)?.getSource().getDistance === 'function'
			? getCluster(map, feature, '_polarLayerId')
			: feature

	selectedCluster.setStyle(
		getMarkerStyle(
			getLayerConfiguration(feature.get('_polarLayerId') as string)
				.selectionStyle,
			selectedCluster.get('features')?.length > 1
		)
	)

	store.selected = markRaw(selectedCluster)
	if (centerOnFeature) {
		const mainStore = useMainStore()
		mainStore.centerOnFeature(store.selected as Feature)
	}
}

function setLayerId(map: Map, feature: Feature) {
	if (feature.get('_polarLayerId')) {
		return
	}

	const layerId = map
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
				return step.hasFeature(feature)
			}
			return false
		})
		?.get('id') as string | undefined
	if (layerId) {
		feature.set('_polarLayerId', layerId, true)
	}
}

export function setupMarkers(map: Map) {
	const store = useMarkerStore()
	const configuration = store.configuration
	if (!configuration) return

	layers = configuration.layers.map((layer) =>
		toMerged(
			{
				defaultStyle,
				hoverStyle,
				selectionStyle,
				unselectableStyle,
				isSelectable: () => true,
			},
			layer
		)
	)

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

	watch(
		() => store.hovered,
		(feature) => {
			if (feature !== null && feature !== toRaw(store.selected)) {
				store.hovered?.setStyle(undefined)
				store.hovered = null
			}
			if (feature !== null && feature !== toRaw(store.selected)) {
				store.hovered = markRaw(feature)
				const isMultiFeature = store.hovered.get('features')?.length > 1
				const style = getMarkerStyle(
					getLayerConfiguration(feature.get('_polarLayerId') as string)
						.hoverStyle,
					isMultiFeature
				)
				store.hovered.setStyle(style)
			}
		}
	)

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

function mapMoveEnd({ map }: MapEvent) {
	const store = useMarkerStore()
	const zoom = map.getView().getZoom() as number
	if (zoom !== lastZoom) {
		lastZoom = zoom
		if (store.selected) {
			const baseFeature = (store.selected.get('features')?.[0] ||
				store.selected) as Feature
			setLayerId(map, baseFeature)
			updateSelection(map, baseFeature)
		}
	}
}

function mapPointerMove({ map, pixel }: MapBrowserEvent<MouseEvent>) {
	const store = useMarkerStore()
	const feature = map.getFeaturesAtPixel(pixel, {
		layerFilter,
	})[0]

	if (feature === toRaw(store.selected) || feature instanceof RenderFeature) {
		return
	}
	if (
		toRaw(store.hovered) !== null &&
		toRaw(store.hovered) !== toRaw(store.selected)
	) {
		store.hovered?.setStyle(undefined)
		store.hovered = null
	}

	if (!feature) {
		return
	}
	setLayerId(map, feature)
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
	store.hovered = markRaw(feature)
}

function mapClick(event: MapBrowserEvent<MouseEvent | TouchEvent>) {
	const store = useMarkerStore()
	const map = event.map
	if (store.selected !== null) {
		updateSelection(map, null)
	}
	const feature = map.getFeaturesAtPixel(event.pixel, { layerFilter })[0]

	if (!feature || feature instanceof RenderFeature) {
		return
	}
	setLayerId(map, feature)
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
	if (store.clusterClickZoom && isMultiFeature && isMaxZoom) {
		resolveClusterClick(map, feature)
		return
	}

	store.hovered?.setStyle(undefined)
	store.hovered = null
	updateSelection(map, feature, true)

	if (store.callOnMapSelect) {
		const mainStore = useMainStore()
		const { action, payload, pluginName } = store.callOnMapSelect
		if (!pluginName) {
			mainStore[action](payload)
			return
		}

		const plugin = mainStore.plugins.find(({ id }) => id === pluginName)
		if (!plugin) {
			console.error(
				`Plugin ${pluginName} does not exist or is not configured. Action ${action} could not be called.`
			)
			return
		}
		const pluginStore = plugin.storeModule?.()
		if (!pluginStore) {
			console.error(
				`Plugin ${pluginName} does not have a store module. Action ${action} could not be called.`
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
