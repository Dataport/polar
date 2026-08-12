/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/draw/store
 */
/* eslint-enable tsdoc/syntax */

import type { FeatureCollection } from 'geojson'
import type { Feature as OlFeature } from 'ol'
import type { EventsKey } from 'ol/events'
import type BaseLayer from 'ol/layer/Base'
import type VectorLayer from 'ol/layer/Vector'
import type { ComputedRef } from 'vue'
import type {
	DownloadMode,
	DrawMode,
	DrawPluginOptions,
	EditMode,
	GeometryType,
	RevisionStateFlag,
	ToolMode,
} from './types'
import type { MeasureMode } from './types'

import { unByKey } from 'ol/Observable'
import Style from 'ol/style/Style'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, markRaw, ref, shallowRef, watch } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useDrawLayer } from './composables/useDrawLayer'
import { complete, error, inactive, inProgress } from './types'
import { MeasureModes, PluginId } from './types'
import { drawSourceToFeatureCollection } from './utils/conversion/drawSourceToFeatureCollection'
import { featureCollectionToDrawSource } from './utils/conversion/featureCollectionToDrawSource'
import { InteractionManager } from './utils/interactionManager'
import { reviseFeatures } from './utils/reviseFeatures'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for fullscreen mode detection and enablement.
 */
/* eslint-enable tsdoc/syntax */
export const useDrawStore = defineStore('plugins/draw', () => {
	const coreStore = useCoreStore()

	let interactionManager: InteractionManager | undefined
	let sourceListenerKeys: EventsKey[] = []

	const configuration = computed(
		() => (coreStore.configuration[PluginId] || {}) as DrawPluginOptions
	)

	const layerConfiguration = computed(() => {
		const l = configuration.value.layers
		// Don't trust configuration, not even your own.
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		return !l || l.length === 0 ? [{}] : l
	})

	// *slaps roof of store*
	const _activeTool = ref<ToolMode | null>(null)
	const _drawMode = ref<DrawMode>('Point')
	const _editMode = ref<EditMode>('modify')
	const _measureMode = ref<MeasureMode>('none')
	const _selectedFeature = shallowRef<OlFeature | null>(null)
	const _textInput = ref('')
	const _textSizeIndex = ref(0)
	const _downloadFormat = ref<DownloadMode>('geojson')
	const _activeLayerId = ref('')
	const _layerIds = ref<string[]>([])
	const _layers = ref<BaseLayer[]>([])
	const _featureCollection = ref<FeatureCollection<GeometryType>>({
		type: 'FeatureCollection',
		features: [],
	})

	const revisedFeatureCollection = ref<FeatureCollection<GeometryType>>({
		type: 'FeatureCollection',
		features: [],
	})
	const revisionStateFlag = ref<RevisionStateFlag>(inactive)
	const drawing = ref(false)

	const reinitializeInteractions = () => {
		if (_activeTool.value) {
			interactionManager?.initializeInteractions(
				_activeTool.value,
				getModeForTool(_activeTool.value),
				{
					measureMode: measureMode.value,
					activeLassoIds: activeLassoIds.value,
					text: {
						textInput: textInput.value,
						textSize: textSizes.value[textSizeIndex.value] ?? 12,
						textStyle: {
							font: activeLayerConfig.value?.textStyle?.font ?? 'sans-serif',
							textColor:
								activeLayerConfig.value?.textStyle?.textColor ?? '#000000',
						},
					},
					selectedFeature,
					drawing,
				}
			)
		}
	}

	const activeLayerId = computed({
		get: () => _activeLayerId.value,
		set: (value) => {
			_activeTool.value = null
			_activeLayerId.value = value
			interactionManager?.updateDrawLayer(activeDrawLayer.value)
		},
	})

	const activeDrawLayer = computed(
		() =>
			_layers.value.find(
				(layer) => layer.get('id') === _activeLayerId.value
			) as VectorLayer
	)

	const activeLayerConfig = computed(() =>
		layerConfiguration.value.find((layer) => layer.id === activeLayerId.value)
	)

	const layerOptions = computed(() => {
		return _layers.value.map((layer) => ({
			value: layer.get('id'),
			label: layer.get('name') ?? layer.get('id'),
		}))
	})

	function getModeForTool(tool: ToolMode) {
		switch (tool) {
			case 'draw':
				return _drawMode.value
			case 'edit':
				return _editMode.value
			default:
				return undefined
		}
	}

	const activeTool = computed({
		get: () => _activeTool.value,
		set: (value) => {
			_activeTool.value = value
			if (_activeTool.value) {
				reinitializeInteractions()
			} else {
				interactionManager?.removeAllInteractions()
			}
		},
	})

	const drawMode = computed({
		get: () => _drawMode.value,
		set: (value) => {
			_drawMode.value = value
			if (activeTool.value !== 'draw') {
				activeTool.value = 'draw'
			} else {
				reinitializeInteractions()
			}
		},
	})

	const drawOptions: ComputedRef<DrawMode[]> = computed(
		() =>
			activeLayerConfig.value?.selectableDrawModes ?? [
				'Point',
				'LineString',
				'Polygon',
			]
	)

	watch(drawOptions, (newOptions) => {
		if (!newOptions.includes(_drawMode.value) && newOptions[0]) {
			_drawMode.value = newOptions[0]
		}
	})

	const editMode = computed({
		get: () => _editMode.value,
		set: (value) => {
			_editMode.value = value
			if (activeTool.value !== 'edit') {
				activeTool.value = 'edit'
			} else {
				reinitializeInteractions()
			}
		},
	})

	const measureMode = computed({
		get: () => _measureMode.value,
		set: (value) => {
			_measureMode.value = value
			if (activeTool.value === 'draw') {
				reinitializeInteractions()
			}
		},
	})

	const measureOptions = computed(() =>
		MeasureModes.reduce<{ value: MeasureMode; label: string }[]>(
			(accumulator, mode) => {
				const isArea = drawMode.value.includes('Polygon')
				if (!isArea && mode === 'hectares') {
					return accumulator
				}
				accumulator.push({ value: mode, label: mode + (isArea ? 'Area' : '') })
				return accumulator
			},
			[]
		)
	)

	watch(measureOptions, (newOptions) => {
		if (
			!newOptions.map((option) => option.value).includes(_measureMode.value)
		) {
			_measureMode.value = newOptions[0]?.value ?? 'none'
		}
	})

	const textInput = computed({
		get: () => _textInput.value,
		set: (value) => {
			_textInput.value = value
			if (activeTool.value === 'draw' && drawMode.value === 'Text') {
				reinitializeInteractions()
			} else if (textIsSelected.value) {
				const style = _selectedFeature.value?.getStyle()
				if (style instanceof Style) {
					const text = style.getText()
					if (text) {
						text.setText(value)
						_selectedFeature.value?.setStyle(style)
					}
				}
			}
		},
	})

	const textSizes = computed(
		// @ts-expect-error | exactly, we want undefined then ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
		() => activeLayerConfig.value?.textStyle?.font?.size ?? []
	)

	const textSizeIndex = computed({
		get: () => (textSizes.value.length > 0 ? _textSizeIndex.value : -1),
		set: (value) => {
			_textSizeIndex.value = value
			if (activeTool.value === 'draw' && drawMode.value === 'Text') {
				reinitializeInteractions()
			} else if (textIsSelected.value) {
				const style = _selectedFeature.value?.getStyle()
				if (style instanceof Style) {
					const text = style.getText()
					if (text) {
						text.setFont(
							text
								.getFont()
								?.replace(/\d+px/, `${textSizes.value[value] ?? 12}px`)
						)
						_selectedFeature.value?.setStyle(style)
					}
				}
			}
		},
	})

	const selectedFeature = computed({
		get: () => _selectedFeature.value,
		set: (value) => {
			_selectedFeature.value = value

			if (value === null) {
				textInput.value = ''
				textSizeIndex.value = 0
			} else {
				const style = value.getStyle()
				if (style instanceof Style) {
					const text = style.getText()
					if (text) {
						const textValue = text.getText()
						// NOTE: no rich text in this tool, formatting ignored
						textInput.value = Array.isArray(textValue)
							? textValue.filter((_, index) => index % 2 === 0).join('')
							: (textValue ?? '')
						const fontSize = text.getFont()?.match(/(\d+)px/)?.[1]
						if (fontSize) {
							const index = textSizes.value.findIndex(
								(size) => size === parseInt(fontSize, 10)
							)
							textSizeIndex.value = index !== -1 ? index : 0
						}
					}
				}
			}
		},
	})

	const textIsSelected = computed(() => {
		const style = _selectedFeature.value?.getStyle()
		return style instanceof Style && Boolean(style.getText())
	})

	const activeLassoIds = computed(() =>
		(activeLayerConfig.value?.lassos || []).reduce<string[]>(
			(accumulator, { id, minZoom = true }) => {
				const layerConfig = coreStore.configuration.layers.find(
					(layer) => id === layer.id
				)
				if (
					minZoom &&
					layerConfig &&
					typeof layerConfig.minZoom !== 'undefined' &&
					coreStore.zoom < layerConfig.minZoom
				) {
					return accumulator
				}
				accumulator.push(id)
				return accumulator
			},
			[]
		)
	)

	const downloadFormat = computed({
		get: () => _downloadFormat.value,
		set: (value: DownloadMode) => {
			_downloadFormat.value = value
		},
	})

	function download() {
		const blob = new Blob([JSON.stringify(featureCollection.value)], {
			type: 'application/geo+json',
		})
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = 'polar.geojson'
		link.href = url
		link.style.display = 'none'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
		URL.revokeObjectURL(url)
	}

	function upload() {
		const drawSource = interactionManager?.getDrawSource()
		if (!drawSource) {
			// TODO: notifyUser to select a draw source
			return
		}
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.geojson,application/geo+json,application/json'
		input.style.display = 'none'
		input.addEventListener('change', () => {
			const file = input.files?.[0]
			if (!file) {
				return
			}
			const reader = new FileReader()
			reader.addEventListener('load', () => {
				try {
					featureCollectionToDrawSource(
						JSON.parse(
							reader.result as string
						) as FeatureCollection<GeometryType>,
						drawSource
					)
					// value then goes to ref featureCollection by interactionManager callback
					const extent = drawSource.getExtent()
					if (extent) {
						coreStore.map.getView().fit(extent, { duration: 500 })
					}
				} catch (e: unknown) {
					console.error(e)
				}
			})
			reader.readAsText(file)
		})
		document.body.appendChild(input)
		input.click()
		document.body.removeChild(input)
	}

	function addFeatures(
		featureCollection: FeatureCollection<GeometryType>,
		overwrite = false
	) {
		const drawSource = interactionManager?.getDrawSource()
		if (!drawSource) {
			// TODO: notifyUser to select a draw source
			return
		}
		if (overwrite) {
			drawSource.clear()
		}
		featureCollectionToDrawSource(featureCollection, drawSource)
	}

	const featureCollection = computed({
		get: () => _featureCollection.value,
		set: (value: FeatureCollection<GeometryType>) => {
			_featureCollection.value = value
			if (activeLayerConfig.value?.revision) {
				revisionStateFlag.value = inProgress
				reviseFeatures(coreStore.map, activeLayerConfig.value.revision, value)
					.then((oneRevvedBoi) => {
						if (oneRevvedBoi !== null) {
							revisedFeatureCollection.value = oneRevvedBoi
							revisionStateFlag.value = complete
						}
					})
					.catch((e: unknown) => {
						if (!(
							// already handled
							e instanceof Error && e.message.startsWith('Autofix failed:')
						)) {
							console.error(e)
						}
						revisionStateFlag.value = error
					})
			}
		},
	})

	function registerLayer(layer: BaseLayer) {
		_layers.value.push(markRaw(layer))
		_layerIds.value.push(layer.get('id'))

		const source = (layer as VectorLayer).getSource()
		if (source) {
			sourceListenerKeys.push(
				...source.on(['addfeature', 'changefeature', 'removefeature'], () => {
					if (layer.get('id') === _activeLayerId.value) {
						drawSourceToFeatureCollection(source, featureCollection)
					}
				})
			)
		}
	}

	function setupPlugin() {
		let syntheticDrawLayerId = 0

		layerConfiguration.value.forEach((layerConfig) => {
			if (layerConfig.id) {
				const layer = coreStore.map
					.getLayers()
					.getArray()
					.find((l) => l.get('id') === layerConfig.id)

				if (layer) {
					registerLayer(layer)
					return
				}
			}
			registerLayer(
				useDrawLayer(
					coreStore.map,
					layerConfig.id ?? `draw-layer-${++syntheticDrawLayerId}`,
					layerConfig.style
				)
			)
		})

		activeLayerId.value = _layerIds.value[0] ?? ''
		interactionManager = new InteractionManager(
			coreStore.map,
			configuration.value,
			activeDrawLayer.value
		)
	}

	function teardownPlugin() {
		interactionManager?.destructor()
		sourceListenerKeys.forEach((key) => {
			unByKey(key)
		})
		sourceListenerKeys = []
		// TODO: check for completeness
	}

	return {
		activeTool,
		drawMode,
		measureMode,
		drawOptions,
		editMode,
		downloadFormat,

		activeLayerId,
		configuration,
		layerOptions,
		measureOptions,
		textInput,
		textSizeIndex,
		textSizes,
		textIsSelected,

		/** True while the user is within a drawing procedure and has a half-baked geometry at hand. */
		drawing,

		/** Indicator of what's going on. */
		revisionStateFlag,

		/** GeoJSON.FeatureCollection containing the currently drawn features. */
		featureCollection,

		/** If revision is configured, this will contain the revision result. Please use the revisionStateFlag to decide if the process is done. */
		revisedFeatureCollection,

		/**
		 * Calling the action `addFeatures` expects an object containing a [GeoJSON](https://geojson.org/) FeatureCollection. It adds the given features from the FeatureCollection to the drawn source. It is also possible to completely overwrite them using the parameter `overwrite`. The feature type "GeometryCollection" is not supported.
		 * It's important to note that the GeoJSON Standard [RFC7946](https://www.rfc-editor.org/rfc/rfc7946) does not support circles. To add a circle to the map, it is assumed, that a feature being a circle has a property `radius` together with a point geometry.
		 * The same goes for text. In that case, a property 'text' with an accompanying 'textFont' property is expected, where 'textFont' matches e.g. "30px sans-serif". The size should match a valid configurable size.
		 */
		addFeatures,

		/** GeoJSON.FeatureCollection goes woo ↓ */
		download,

		/** GeoJSON.FeatureCollection goes wee ↑ */
		upload,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

// TODO: hot reloading fails a lot
if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDrawStore, import.meta.hot))
}
