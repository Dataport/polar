/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pins/store
 */
/* eslint-enable tsdoc/syntax */

import { toMerged } from 'es-toolkit'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { PinsPluginOptions } from './types'
import { useCoreStore } from '@/core/stores/export'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * TODO
 */
/* eslint-enable tsdoc/syntax */
export const usePinsStore = defineStore('plugins/pins', () => {
	const coreStore = useCoreStore()

	const coordinatesAfterDrag = ref<[number, number]>([])
	const getsDragged = ref(false)
	const latLon = ref<[number, number]>([])
	const transformedCoordinate = ref<[number, number]>([])

	const configuration = computed<PinsPluginOptions>(() =>
		toMerged(
			{ minZoomLevel: 0, movable: 'none', toZoomLevel: 0 },
			coreStore.configuration.pins
		)
	)
	function setupPlugin() {}
	function teardownPlugin() {}

	return {
		/**
		 * The pinCoordinate {@link transformedCoordinate} transcribed to latitude / longitude.
		 */
		latLon,
		transformedCoordinate,
		/** @internal */
		setupPlugin,
		/** @internal */
		teardownPlugin,
	}
})
