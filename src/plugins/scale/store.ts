/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/scale/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { useCoreStore } from '@/core/stores'
import { useDpi } from '@/lib/dpi'

import { beautifyScale } from './utils/beautifyScale'
import { calculateScaleFromResolution } from './utils/calculateScaleFromResolution'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the scale.
 */
/* eslint-enable tsdoc/syntax */
export const useScaleStore = defineStore('plugins/scale', () => {
	const coreStore = useCoreStore()
	const { dpi } = useDpi()

	const scaleValue = ref<number>(0)

	const scaleToOne = computed(() =>
		beautifyScale(scaleValue.value, coreStore.language)
	)

	const scaleWithUnit = computed(() => {
		const scaleNumber = Math.round(0.02 * scaleValue.value)

		return scaleNumber >= 1000
			? `${Math.round(scaleNumber / 100) / 10}km`
			: `${scaleNumber}m`
	})

	const zoomOptions = computed(() =>
		coreStore.configuration.options.map((option) => ({
			...option,
			label: beautifyScale(
				calculateScaleFromResolution(
					coreStore.map.getView().getProjection().getUnits(),
					option.resolution,
					dpi.value
				),
				coreStore.language
			),
			value: option.zoomLevel,
		}))
	)

	const layoutTag = computed(() => coreStore.configuration.scale?.layoutTag)

	const showScaleSwitcher = computed(
		() =>
			coreStore.configuration.scale?.showScaleSwitcher &&
			zoomOptions.value.length > 0
	)

	function updateScale(): void {
		const unit = coreStore.map.getView().getProjection().getUnits()
		const resolution: number = coreStore.map.getView().getResolution() as number
		const scale: number = calculateScaleFromResolution(
			unit,
			resolution,
			dpi.value
		)

		scaleValue.value = scale
	}

	function setupPlugin() {
		coreStore.map.on('moveend', updateScale)
	}

	function teardownPlugin() {
		coreStore.map.un('moveend', updateScale)
	}

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/**
		 * If {@link MapConfiguration.layout | `mapConfiguration.layout`} is set to `'nineRegions'`,
		 * then this parameter declares the positioning of the ScaleWidget.
		 * @alpha
		 */
		layoutTag,

		/**
		 * A string of format `1 : x`, with x being a number, indicating resolution. Rounded value.
		 * @alpha
		 */
		scaleToOne,

		/**
		 * A string of format `xy`, with x being a number, and y being the unit (either `m` or `km`), indicating
		 * the actual width of 2 on-screen cm. Rounded value.
		 * @alpha
		 */
		scaleWithUnit,

		/**
		 * Indicates whether, instead of a `1 : x` scale, a switch element (e.g. select) should be displayed.
		 * @alpha
		 */
		showScaleSwitcher,

		/**
		 * Available options for zoom levels.
		 * @alpha
		 */
		zoomOptions,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useScaleStore, import.meta.hot))
}
