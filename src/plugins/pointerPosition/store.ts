/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pointerPosition/store
 */
/* eslint-enable tsdoc/syntax */

import { type Coordinate, createStringXY } from 'ol/coordinate'
import { transform } from 'ol/proj'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the pointerPosition.
 */
/* eslint-enable tsdoc/syntax */
export const usePointerPositionStore = defineStore(
	'plugins/pointerPosition',
	() => {
		const coreStore = useCoreStore()

		const selectedProjectionIndex = ref(0)
		const pointerPosition = ref<Coordinate>([])

		const availableProjections = computed(() =>
			coreStore.configuration.pointerPosition?.projections
				? coreStore.configuration.pointerPosition.projections.map((entry) => ({
						...entry,
						decimals: entry.decimals ?? 4,
					}))
				: coreStore.configuration.namedProjections.map(([code]) => ({
						code,
						decimals: 4,
					}))
		)

		const currentEpsgSystem = computed(() => {
			const projection =
				availableProjections.value[selectedProjectionIndex.value]
			if (!projection) {
				throw new Error(
					'selectedProjectionIndex out of bounds. This should never happen.'
				)
			}
			return projection
		})

		const selectedProjection = computed({
			get: () => currentEpsgSystem.value.code,
			set: (value) => {
				const index = availableProjections.value.findIndex(
					({ code }) => code === value
				)
				if (index !== -1) {
					selectedProjectionIndex.value = index
					return
				}
				console.error(`EPSG code ${value} not found in available projections.`)
			},
		})

		const formattedPointerPosition = computed(() =>
			pointerPosition.value.length
				? createStringXY(currentEpsgSystem.value.decimals)(
						transform(
							pointerPosition.value,
							coreStore.map.getView().getProjection().getCode(),
							selectedProjection.value
						)
					)
				: 'X, Y'
		)

		const updatePointerPosition = ({ coordinate }) =>
			(pointerPosition.value = coordinate)

		function setupPlugin() {
			coreStore.map.on('pointermove', updatePointerPosition)
		}

		function teardownPlugin() {
			coreStore.map.un('pointermove', updatePointerPosition)
		}
		return {
			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,

			/**
			 * Offers last pointer position as formatted string `X, Y` in selected
			 * EPSG system with decimal cut-off applied.
			 */
			formattedPointerPosition,

			/**
			 * Array of available projections; either configured set or
			 * {@link MasterportalApiConfiguration.namedProjections | `mapConfiguration.namedProjections`}.
			 * @alpha
			 */
			availableProjections,

			/**
			 * Currently selected projection as EPSG code, e.g. `EPSG:4326`.
			 * @alpha
			 */
			selectedProjection,
		}
	}
)

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(usePointerPositionStore, import.meta.hot)
	)
}
