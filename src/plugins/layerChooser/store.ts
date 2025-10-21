/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser/store
 */
/* eslint-enable tsdoc/syntax */

import { toMerged } from 'es-toolkit'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import Layer from 'ol/layer/Layer'
import { ImageWMS, TileWMS } from 'ol/source'
import type { LayerOptions } from './types'
import { areLayersActive } from './utils/areLayersActive'
import {
	loadCapabilities,
	prepareLayersWithOptions,
} from './utils/capabilities'
import { getBackgroundsAndMasks } from './utils/getBackgroundsAndMasks'
import type { LayerConfiguration } from '@/core'
import { useCoreStore } from '@/core/stores/export'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the layer chooser.
 */
/* eslint-enable tsdoc/syntax */
export const useLayerChooserStore = defineStore('plugins/layerChooser', () => {
	const coreStore = useCoreStore()

	const capabilities = ref<Record<string, string | null>>({})

	const backgrounds = ref<LayerConfiguration[]>([])
	const masks = ref<LayerConfiguration[]>([])
	const availableBackgrounds = ref<LayerConfiguration[]>([])
	const availableMasks = ref<LayerConfiguration[]>([])
	const activeBackgroundId = ref('')
	const activeMaskIds = ref<string[]>([])

	const layersWithOptions = ref<Record<string, LayerOptions[]>>({})
	const openedOptionsId = ref('')

	const disabledBackgrounds = computed(() => {
		return backgrounds.value.reduce(
			(acc, { id }) => ({
				...acc,
				[id]:
					availableBackgrounds.value.findIndex(
						({ id: availableId }) => availableId === id
					) === -1,
			}),
			{}
		)
	})
	const disabledMasks = computed(() =>
		shownMasks.value.reduce(
			(acc, { id }) => ({
				...acc,
				[id]:
					availableMasks.value.findIndex(
						({ id: availableId }) => availableId === id
					) === -1,
			}),
			{}
		)
	)
	const shownMasks = computed(() =>
		masks.value.filter(({ hideInMenu }) => !hideInMenu)
	)
	const masksSeparatedByType = computed(() =>
		shownMasks.value.reduce<Record<string, LayerConfiguration[]>>(
			(acc, mask) =>
				toMerged(acc, {
					[mask.type]: Array.isArray(acc[mask.type])
						? // @ts-expect-error | TS says it might be undefined, even though the previous line checks existence.
							acc[mask.type].concat(mask)
						: [mask],
				}),
			{}
		)
	)

	function setupPlugin() {
		const [configuredBackgrounds, configuredMasks] = getBackgroundsAndMasks(
			coreStore.configuration.layers
		)
		backgrounds.value = configuredBackgrounds
		masks.value = configuredMasks

		if (configuredBackgrounds.length === 0) {
			console.error('No layers of type "background" have been configured.')
		}

		// At most one background, arbitrarily many masks
		activeBackgroundId.value =
			configuredBackgrounds.find(({ visibility }) => visibility)?.id || ''
		setActiveMaskIds(
			configuredMasks.filter(({ visibility }) => visibility).map(({ id }) => id)
		)
		updateActiveAndAvailableLayersByZoom()
		coreStore.map.on('moveend', updateActiveAndAvailableLayersByZoom)
		// NOTE: Not relevant to be awaited.
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		loadCapabilities(coreStore.configuration.layers, capabilities.value).then(
			(newCapabilities) => {
				capabilities.value = newCapabilities

				coreStore.configuration.layers.forEach((layer) => {
					const layerOptions = layer.options?.layers
					if (layerOptions) {
						layersWithOptions.value = toMerged(
							layersWithOptions.value,
							prepareLayersWithOptions(layer.id, newCapabilities, layerOptions)
						)
					}
				})
			}
		)
	}
	function teardownPlugin() {}

	watch(activeBackgroundId, (id) => {
		coreStore.map
			.getLayers()
			.getArray()
			.forEach((layer) => {
				// Only influence visibility if layer is managed as background
				if (backgrounds.value.find(({ id }) => id === layer.get('id'))) {
					layer.setVisible(layer.get('id') === id)
				}
			})
	})

	function setActiveMaskIds(ids: string[]) {
		setActiveMaskIdsVisibility(ids)
		activeMaskIds.value = ids
	}

	function setActiveMaskIdsVisibility(ids: string[]) {
		coreStore.map
			.getLayers()
			.getArray()
			.forEach((layer) => {
				// Only influence visibility if layer is managed as a mask
				if (masks.value.find(({ id }) => id === layer.get('id'))) {
					layer.setVisible(ids.includes(layer.get('id')))
				}
			})
	}

	function updateActiveAndAvailableLayersByZoom() {
		/*
		 * NOTE: It is assumed that getZoom actually returns the currentZoomLevel,
		 * thus the view has a constraint in the resolution.
		 */
		const currentZoomLevel = coreStore.map.getView().getZoom() as number

		availableBackgrounds.value = areLayersActive(
			backgrounds.value,
			currentZoomLevel
		)
		availableMasks.value = areLayersActive(masks.value, currentZoomLevel)

		const availableBackgroundIds = availableBackgrounds.value.map(
			({ id }) => id
		)

		// If the background map is no longer available, switch to first-best or none
		if (!availableBackgroundIds.includes(activeBackgroundId.value)) {
			activeBackgroundId.value = availableBackgroundIds[0] || ''
		}

		/*
		 * Update mask layer visibility, but don't toggle on/off in the UI.
		 * We still keep active layers active even when currently not available,
		 * so after zooming back they snap right back in.
		 */
		setActiveMaskIdsVisibility(
			availableMasks.value
				.map(({ id }) => id)
				.filter((id) => activeMaskIds.value.includes(id))
		)
	}

	function toggleOpenedOptionsServiceLayer(layerIds: string[]) {
		const olSource = (
			coreStore.map
				.getLayers()
				.getArray()
				.find((l) => l.get('id') === openedOptionsId.value) as Layer<
				ImageWMS | TileWMS
			>
		).getSource()

		if (!olSource) {
			console.error(
				`Action 'toggleOpenedOptionsServiceLayer' failed on ${openedOptionsId.value}. Layer not found in OpenLayers or source not initialized in OpenLayers.`
			)
			return
		}
		olSource.updateParams({ ...olSource.getParams(), LAYERS: layerIds })
	}

	return {
		/** Id of the currently active background layer. */
		activeBackgroundId,

		/**
		 * Ids of the currently active mask layers without distinction between mask groups.
		 */
		activeMaskIds,

		/** @internal */
		backgrounds,

		/**
		 * Maps a layer id to its GetCapabilities xml return value or null if an error happened.
		 *
		 * @internal
		 */
		capabilities,

		/** @internal */
		disabledBackgrounds,

		/** @internal */
		disabledMasks,

		/** @internal */
		layersWithOptions,

		/** @internal */
		masksSeparatedByType,

		/** @internal */
		shownMasks,

		/** @internal */
		openedOptionsId,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/** @internal */
		setActiveMaskIds,

		/** @internal */
		toggleOpenedOptionsServiceLayer,
	}
})
