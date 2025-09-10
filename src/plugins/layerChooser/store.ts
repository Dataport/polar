/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/layerChooser/store
 */
/* eslint-enable tsdoc/syntax */

import { rawLayerList } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'
import WMSCapabilities from 'ol/format/WMSCapabilities'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import Layer from 'ol/layer/Layer'
import { ImageWMS, TileWMS } from 'ol/source'
import type { LayerOptions } from './types'
import { areLayersActive } from './utils/areLayersActive'
import { getBackgroundsAndMasks } from './utils/getBackgroundsAndMasks'
import {
	findLayerTitleInCapabilitiesByName,
	findLegendUrlInCapabilitiesByName,
} from './utils/findInCapabilities.ts'
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
	const wmsCapabilitiesAsJsonById = computed(
		() =>
			(id: string): object | null => {
				const xml = capabilities.value[id]
				if (xml) {
					try {
						return new WMSCapabilities().read(xml)
					} catch (e) {
						console.error(`Error reading xml '${xml}' for id '${id}'.`, e)
					}
				}
				return null
			}
	)

	function setupPlugin() {
		let attemptCounter = 0
		// NOTE: Currently needed as the whole application no longer waits on the retrieval of the layerList
		const intervalId = setInterval(() => {
			if (attemptCounter < 100 && rawLayerList.getLayerList().length === 0) {
				attemptCounter += 1
			} else if (attemptCounter === 100) {
				console.error(
					'The serviceRegister does not yield any layer information. This seems to be a configuration or network error.'
				)
				clearInterval(intervalId)
			} else {
				const [configuredBackgrounds, configuredMasks] = getBackgroundsAndMasks(
					coreStore.configuration.layers
				)
				backgrounds.value = configuredBackgrounds
				masks.value = configuredMasks

				// At most one background, arbitrarily many masks
				setActiveBackgroundId(
					configuredBackgrounds.find(({ visibility }) => visibility)?.id || null
				)
				setActiveMaskIds(
					configuredMasks
						.filter(({ visibility }) => visibility)
						.map(({ id }) => id)
				)
				updateActiveAndAvailableLayersByZoom()
				coreStore.map.on('moveend', updateActiveAndAvailableLayersByZoom)
				prepareLayersWithOptions()
				clearInterval(intervalId)
			}
		}, 100)
	}
	function teardownPlugin() {}

	function setActiveBackgroundId(id: string | null) {
		if (id === null) {
			console.error(
				'Trying to set null as the active background layer is not possible. This is probably a configuration issue.'
			)
			return
		}
		coreStore.map
			.getLayers()
			.getArray()
			.forEach((layer) => {
				// Only influence visibility if layer is managed as background
				if (backgrounds.value.find(({ id }) => id === layer.get('id'))) {
					layer.setVisible(layer.get('id') === id)
				}
			})
		activeBackgroundId.value = id
	}

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
			setActiveBackgroundId(availableBackgroundIds[0] || null)
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

	function loadCapabilities(id: string) {
		const previous = capabilities.value[id]
		if (typeof previous !== 'undefined' && previous !== null) {
			console.warn(
				`Re-fired loadCapabilities on id '${id}' albeit the GetCapabilities have already been successfully fetched. No re-fetch will occur.`
			)
			return new Promise<void>((resolve) => {
				resolve()
			})
		}

		// block access to prevent duplicate requests
		capabilities.value[id] = null

		const service = rawLayerList.getLayerWhere({ id })
		if (!service || !service.url || !service.version || !service.typ) {
			console.error(`Missing data for service '${service}' with id '${id}'.`)
			return
		}

		const capabilitiesUrl = `${service.url}?service=${service.typ}&version=${service.version}&request=GetCapabilities`

		return fetch(capabilitiesUrl)
			.then((response) => response.text())
			.then((string) => (capabilities.value[id] = string))
			.catch((e: unknown) => {
				console.error(
					`@polar/core: Capabilities from ${capabilitiesUrl} could not be fetched.`,
					e
				)
				capabilities.value[id] = null
			})
	}

	function prepareLayersWithOptions() {
		const configuredLayers = coreStore.configuration.layers

		// NOTE: Not relevant to be awaited.
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		Promise.allSettled(
			configuredLayers.map(
				(layer) =>
					// NOTE: It may result in void.
					// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
					new Promise<string | void>((resolve) => {
						const layerOptions = layer.options?.layers
						if (
							layerOptions &&
							(layerOptions.title === true || layerOptions.legend === true)
						) {
							resolve(loadCapabilities(layer.id))
						}
						resolve()
					})
			)
		).then(() => {
			configuredLayers.forEach((layer) => {
				const rawLayer: { layers: string } = rawLayerList.getLayerWhere({
					id: layer.id,
				})
				const layerOptions = layer.options?.layers
				if (layerOptions) {
					const wmsCapabilitiesJson = wmsCapabilitiesAsJsonById.value(layer.id)
					layersWithOptions.value = toMerged(layersWithOptions.value, {
						[layer.id]: (
							layerOptions.order?.split(',') || rawLayer.layers.split(',')
						).map((layerName) => ({
							layerName,
							displayName:
								layerOptions.title === true && wmsCapabilitiesJson
									? findLayerTitleInCapabilitiesByName(
											wmsCapabilitiesJson,
											layerName
										)
									: layerOptions.title === false
										? layerName
										: layerOptions.title?.[layerName] || layerName,
							layerImage:
								layerOptions.legend === true && wmsCapabilitiesJson
									? findLegendUrlInCapabilitiesByName(
											wmsCapabilitiesJson,
											layerName
										)
									: layerOptions.legend === false
										? null
										: layerOptions.legend?.[layerName] || null,
						})),
					})
				}
			})
		})
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
		setActiveBackgroundId,
		/** @internal */
		setActiveMaskIds,
		/** @internal */
		toggleOpenedOptionsServiceLayer,
	}
})
