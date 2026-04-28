/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/pointerPosition/store
 */
/* eslint-enable tsdoc/syntax */

import { type Coordinate, createStringXY } from 'ol/coordinate'
import { transform } from 'ol/proj'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, computed, type Ref } from 'vue'

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

		const selectedProjection = ref(0)
		const pointerPosition: Ref<Coordinate> = ref([])

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

		const currentEpsgSystem = computed(
			() => availableProjections.value[selectedProjection.value]
		)

		const formattedPointerPosition = computed(() =>
			pointerPosition.value.length
				? createStringXY(
						availableProjections.value[selectedProjection.value]?.decimals ?? 4
					)(
						transform(
							pointerPosition.value,
							coreStore.map.getView().getProjection().getCode(),
							currentEpsgSystem.value?.code
						)
					)
				: 'X, Y'
		)

		const updatePointerPosition = ({ coordinate }) =>
			(pointerPosition.value = coordinate)

		const setSelectedProjection = (
			nextSelectedProjection: string | string[] | number
		) => {
			selectedProjection.value = Number(
				Array.isArray(nextSelectedProjection)
					? nextSelectedProjection[0]
					: nextSelectedProjection
			)
		}

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
			 * Offers last pointer position as formatted string `X, Y` in selected EPSG system with decimal cut-off applied.
			 * @alpha
			 */
			formattedPointerPosition,

			/**
			 * Array of available projections; either configured set or `namedProjections`.
			 * @alpha
			 */
			availableProjections,

			/**
			 * Index of selected projection.
			 * @alpha
			 */
			selectedProjection,

			/**
			 * Currently selected EPSG system configuration.
			 * @alpha
			 */
			currentEpsgSystem,

			/**
			 * Setter for selected projection.
			 * @alpha
			 */
			setSelectedProjection,
		}
	}
)

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(usePointerPositionStore, import.meta.hot)
	)
}
