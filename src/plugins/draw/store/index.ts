/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/draw/store
 */
/* eslint-enable tsdoc/syntax */

import { t } from 'i18next'
import BaseLayer from 'ol/layer/Base'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import {
	type DownloadMode,
	type DrawMode,
	type DrawPluginOptions,
	type EditMode,
	PluginId,
	type PropertyMode,
} from '../types'
import { createDrawLayer } from '../utils/drawLayer'
import { InteractionManager } from '../utils/interactionManager'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for fullscreen mode detection and enablement.
 */
/* eslint-enable tsdoc/syntax */
export const useDrawStore = defineStore('plugins/draw', () => {
	const coreStore = useCoreStore()
	const { map } = storeToRefs(coreStore)

	let interactionManager: InteractionManager | undefined

	const configuration = computed(
		() => (coreStore.configuration[PluginId] || {}) as DrawPluginOptions
	)

	const _activeTool = ref<'draw' | 'edit' | 'property' | 'delete' | null>(null)
	const _drawMode = ref<DrawMode>('Point')
	const _editMode = ref<EditMode>('modify')
	const _propertyMode = ref<PropertyMode>('attributes')
	const _downloadFormat = ref<DownloadMode>('geojson')

	const _activeLayerId = ref('')
	const _layerIds = ref<string[]>([])
	const _layers = ref<BaseLayer[]>([])

	const activeLayerId = computed({
		get: () => _activeLayerId.value,
		set: (value) => {
			_activeTool.value = null
			_activeLayerId.value = value
			interactionManager?.updateDrawLayer(value)
		},
	})

	const layerOptions = computed(() => {
		return _layers.value.map((layer) => ({
			value: layer.get('id'),
			label: t(($) => $.layerSelection.labelPrefix, {
				layerName: layer.get('name') ?? layer.get('id'),
				ns: PluginId,
			}),
		}))
	})

	function getModeForTool(tool: 'draw' | 'edit' | 'property' | 'delete') {
		switch (tool) {
			case 'draw':
				return _drawMode.value
			case 'edit':
				return _editMode.value
			case 'property':
				return _propertyMode.value
			default:
				return undefined
		}
	}

	const activeTool = computed({
		get: () => _activeTool.value,
		set: (value) => {
			_activeTool.value = value
			if (_activeTool.value) {
				interactionManager?.initializeInteractions(
					_activeTool.value,
					getModeForTool(_activeTool.value)
				)
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
				interactionManager?.initializeInteractions(
					activeTool.value,
					getModeForTool(activeTool.value)
				)
			}
		},
	})

	const editMode = computed({
		get: () => _editMode.value,
		set: (value) => {
			_editMode.value = value
			if (activeTool.value !== 'edit') {
				activeTool.value = 'edit'
			} else {
				interactionManager?.initializeInteractions(
					activeTool.value,
					getModeForTool(activeTool.value)
				)
			}
		},
	})

	const propertyMode = computed({
		get: () => _propertyMode.value,
		set: (value) => {
			_propertyMode.value = value
			if (activeTool.value !== 'property') {
				activeTool.value = 'property'
			}
			// TODO: update interactions
		},
	})

	const downloadFormat = computed({
		get: () => _downloadFormat.value,
		set: (value: DownloadMode) => {
			_downloadFormat.value = value
		},
	})

	function save() {
		/* TODO: maybe not in first iteration */
	}

	function download() {
		/* TODO: was this ever a feature? trivial to implement for GeoJSON tho */
	}

	function upload() {
		/* TODO: Eventually */
	}

	function setupPlugin() {
		let syntheticDrawLayerId = 0

		let layers = configuration.value.layers

		// Don't trust configuration
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!layers || layers.length === 0) {
			layers = [
				{
					/* TODO: maybe default config here */
					style: {
						point: {
							imageCircle: {
								fill: { color: 'rgba(255, 255, 255, 0.6)' },
								radius: '10',
								stroke: { color: '#000000', width: 2.5 },
							},
						},
						lineString: {
							stroke: { color: '#000000', width: 5, lineDash: [3, 10] },
						},
						polygon: {
							fill: {
								color: 'rgba(255, 255, 255, 0.4)',
								hatch: { pattern: 'diagonal' },
							},
							stroke: { color: 'cadetblue', width: 5 },
						},
						text: {
							text: {
								fill: { color: '#FFAA00' },
								font: 'bold 30px sans-serif',
								stroke: { color: '#0055FF', width: 5 },
								offsetX: '50',
								offsetY: '10',
								rotation: '0.3',
							},
							stroke: { color: '#000000' },
						},
					},
				},
				{
					/* TODO: remove this one, it's for testing layer selection during development */
				},
			]
		}

		layers.forEach((layerConfig) => {
			if (layerConfig.id) {
				const layer = map.value
					.getLayers()
					.getArray()
					.find((l) => l.get('id') === layerConfig.id)

				if (layer) {
					_layers.value.push(layer)
					_layerIds.value.push(layerConfig.id)
					return
				}
			}

			const localLayer = createDrawLayer(
				layerConfig.style,
				// TODO: think about nicer name, or map to something readable in UI
				`synthetic-draw-layer-${syntheticDrawLayerId++}`
			)

			map.value.addLayer(localLayer)
			_layers.value.push(localLayer)
			_layerIds.value.push(localLayer.get('id'))
		})

		activeLayerId.value = _layerIds.value[0] ?? ''
		interactionManager = new InteractionManager(
			map.value,
			configuration.value,
			activeLayerId.value
		)
	}

	function teardownPlugin() {
		/* TODO: */
	}

	return {
		activeTool,
		drawMode,
		editMode,
		propertyMode,
		downloadFormat, // TODO: activeDownloadFormat

		activeLayerId,
		layerOptions,

		save,
		download,
		upload,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useDrawStore, import.meta.hot))
}
