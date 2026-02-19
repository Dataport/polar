/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/zoom/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId, type ZoomPluginOptions } from './types'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for zoom buttons and zoom slider.
 */
/* eslint-enable tsdoc/syntax */
export const useZoomStore = defineStore('plugins/zoom', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as ZoomPluginOptions
	)

	const zoomLevel = computed({
		get: () => coreStore.zoom,
		set: (value) => {
			coreStore.zoom = value
		},
	})

	const zoomLevels = computed(() =>
		coreStore.configuration.options.map((option) => option.zoomLevel)
	)
	const minimumZoomLevel = computed(() => Math.min(...zoomLevels.value))
	const maximumZoomLevel = computed(() => Math.max(...zoomLevels.value))
	const minimumZoomLevelActive = computed(
		() => coreStore.zoom === minimumZoomLevel.value
	)
	const maximumZoomLevelActive = computed(
		() => coreStore.zoom === maximumZoomLevel.value
	)

	const zoomButtonsVisible = computed(
		() => configuration.value.showMobile || !coreStore.hasSmallDisplay
	)

	const zoomInIcon = computed(
		() => configuration.value.icons?.zoomIn ?? 'kern-icon--zoom-in'
	)
	const zoomOutIcon = computed(
		() => configuration.value.icons?.zoomIn ?? 'kern-icon--zoom-out'
	)

	const zoomSliderVisible = computed(() => configuration.value.showZoomSlider)

	const renderType = computed(() =>
		configuration.value.renderType === 'iconMenu'
			? 'iconMenu'
			: (configuration.value.orientation ?? 'horizontal')
	)

	return {
		/**
		 * Current zoom level.
		 */
		zoomLevel,

		/**
		 * Minimum zoom level.
		 *
		 * @readonly
		 */
		minimumZoomLevel,

		/**
		 * Whether minimum zoom level is active.
		 *
		 * @readonly
		 */
		minimumZoomLevelActive,

		/**
		 * Maximum zoom level.
		 *
		 * @readonly
		 */
		maximumZoomLevel,

		/**
		 * Whether maximum zoom level is active.
		 *
		 * @readonly
		 */
		maximumZoomLevelActive,

		/**
		 * Whether zoom buttons should be rendered.
		 *
		 * @alpha
		 * @readonly
		 */
		zoomButtonsVisible,

		/**
		 * Whether zoom slider should be rendered.
		 *
		 * @alpha
		 * @readonly
		 */
		zoomSliderVisible,

		/**
		 * CSS icon class for the icon of the zoom in button.
		 *
		 * @alpha
		 * @readonly
		 */
		zoomInIcon,

		/**
		 * CSS icon class for the icon of the zoom out button.
		 *
		 * @alpha
		 * @readonly
		 */
		zoomOutIcon,

		/**
		 * Defines the rendering type.
		 * This may be `iconMenu` or the configured orientation otherwise.
		 *
		 * @alpha
		 * @readonly
		 */
		renderType,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useZoomStore, import.meta.hot))
}
