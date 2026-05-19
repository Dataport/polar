/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/zoom/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { useIconMenuStore } from '../iconMenu/store'
import { PluginId, type ZoomPluginOptions } from './types'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for zoom buttons and zoom slider.
 */
/* eslint-enable tsdoc/syntax */
export const useZoomStore = defineStore('plugins/zoom', () => {
	const {
		deviceIsHorizontal,
		hasSmallDisplay,
		configuration: coreStoreConfiguration,
		zoom,
	} = storeToRefs(useCoreStore())

	const configuration = computed(
		() => coreStoreConfiguration.value[PluginId] as ZoomPluginOptions
	)

	const zoomLevel = computed({
		get: () => zoom.value,
		set: (value) => {
			zoom.value = value
		},
	})

	const layoutTag = computed(() => configuration.value.layoutTag ?? '')

	const zoomLevels = computed(() =>
		coreStoreConfiguration.value.options.map((option) => option.zoomLevel)
	)
	const minimumZoomLevel = computed(() => Math.min(...zoomLevels.value))
	const maximumZoomLevel = computed(() => Math.max(...zoomLevels.value))
	const minimumZoomLevelActive = computed(
		() => zoomLevel.value <= minimumZoomLevel.value
	)
	const maximumZoomLevelActive = computed(
		() => zoomLevel.value >= maximumZoomLevel.value
	)

	const renderType = computed(
		() => configuration.value.renderType ?? 'independent'
	)

	const renderHorizontal = computed(
		() =>
			(renderType.value === 'iconMenu' && deviceIsHorizontal.value) ||
			(renderType.value === 'independent' &&
				['TOP_MIDDLE', 'BOTTOM_MIDDLE'].includes(layoutTag.value))
	)

	const { layoutTag: iconMenuLayoutTag } = storeToRefs(useIconMenuStore())

	const tooltipPosition = computed(() =>
		layoutTag.value
			? layoutTag.value.includes('RIGHT')
				? 'left'
				: 'right'
			: iconMenuLayoutTag.value.includes('RIGHT')
				? 'left'
				: 'right'
	)

	const zoomUiVisible = computed(
		() => configuration.value.showMobile || !hasSmallDisplay.value
	)
	const zoomSliderVisible = computed(() => configuration.value.showZoomSlider)

	const zoomInIcon = computed(
		() => configuration.value.icons?.zoomIn ?? 'kern-icon--add'
	)
	const zoomOutIcon = computed(
		() => configuration.value.icons?.zoomOut ?? 'kern-icon--remove'
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
		 * Whether zoom buttons and slider should be rendered.
		 *
		 * @alpha
		 * @readonly
		 */
		zoomUiVisible,

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
		 *
		 * @alpha
		 * @readonly
		 */
		renderType,

		/**
		 * Whether the zoom UI should be rendered horizontally.
		 *
		 * @alpha
		 * @readonly
		 */
		renderHorizontal,

		/**
		 * Indicates in which direction of the element space is available for a tooltip.
		 *
		 * @alpha
		 * @readonly
		 */
		tooltipPosition,

		/**
		 * Layout tag when used with independent rendering in NineLayout.
		 *
		 * @alpha
		 * @readonly
		 */
		layoutTag,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useZoomStore, import.meta.hot))
}
