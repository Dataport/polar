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
	const dpiDibs = Symbol('dpi token')
	const coreStore = useCoreStore()
	const { dpi, yoink, yeet } = useDpi()

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
		yoink(dpiDibs)
	}

	function teardownPlugin() {
		coreStore.map.un('moveend', updateScale)
		yeet(dpiDibs)
	}

	return {
		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/** @internal */
		layoutTag,

		/** @internal */
		scaleToOne,

		/** @internal */
		scaleWithUnit,

		/** @internal */
		showScaleSwitcher,

		/** @internal */
		zoomOptions,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useScaleStore, import.meta.hot))
}
