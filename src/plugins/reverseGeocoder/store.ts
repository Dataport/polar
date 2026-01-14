/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/reverseGeocoder/store
 */
/* eslint-enable tsdoc/syntax */

import type { Mock } from 'vitest'

import { easeOut } from 'ol/easing'
import { Point } from 'ol/geom'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, watch, type Reactive, type WatchHandle } from 'vue'

import { useCoreStore } from '@/core/stores/export'
import { indicateLoading } from '@/lib/indicateLoading'

import {
	PluginId,
	type ReverseGeocoderFeature,
	type ReverseGeocoderPluginOptions,
} from './types'
import { reverseGeocode as reverseGeocodeUtil } from './utils/reverseGeocode'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for reverse geocoder that converts coordinates into addresses.
 */
/* eslint-enable tsdoc/syntax */
export const useReverseGeocoderStore = defineStore(
	'plugins/reverseGeocoder',
	() => {
		const coreStore = useCoreStore()

		const configuration = computed(
			() => coreStore.configuration[PluginId] as ReverseGeocoderPluginOptions
		)

		const watchHandles = ref<WatchHandle[]>([])

		function setupPlugin() {
			for (const source of configuration.value.coordinateSources || []) {
				const store = source.plugin
					? coreStore.getPluginStore(source.plugin)
					: coreStore
				if (!store) {
					continue
				}
				watchHandles.value.push(
					watch(
						() => store[source.key],
						async (coordinate) => {
							if (coordinate) {
								await reverseGeocode(coordinate)
							}
						},
						{ immediate: true }
					)
				)
			}
		}

		function teardownPlugin() {
			watchHandles.value.forEach((handle) => {
				handle()
			})
		}

		function passFeatureToTarget(
			target: NonNullable<ReverseGeocoderPluginOptions['addressTarget']>,
			feature: ReverseGeocoderFeature
		) {
			const targetStore = target.plugin
				? coreStore.getPluginStore(target.plugin)
				: coreStore
			if (!targetStore) {
				return
			}
			targetStore[target.key] = feature
		}

		async function reverseGeocode(coordinate: [number, number]) {
			const finish = indicateLoading()
			try {
				const feature = await reverseGeocodeUtil(
					configuration.value.url,
					coordinate
				)
				if (configuration.value.addressTarget) {
					passFeatureToTarget(configuration.value.addressTarget, feature)
				}
				if (configuration.value.zoomTo) {
					coreStore.map.getView().fit(new Point(coordinate), {
						maxZoom: configuration.value.zoomTo,
						duration: 400,
						easing: easeOut,
					})
				}
				return feature
			} catch (error) {
				console.error('Reverse geocoding failed:', error)
				return null
			} finally {
				finish()
			}
		}

		return {
			/**
			 * Resolve address for the given coordinate.
			 *
			 * @param coordinate - Coordinate to reverse geocode.
			 * @returns A promise that resolves to the reverse geocoded feature or null.
			 */
			reverseGeocode,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)

if (import.meta.vitest) {
	const { expect, test: _test, vi } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')
	const { reactive } = await import('vue')
	const useCoreStoreFile = await import('@/core/stores/export')
	const reverseGeocodeUtilFile = await import('./utils/reverseGeocode')
	const indicateLoadingFile = await import('@/lib/indicateLoading')

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		reverseGeocodeUtil: Mock<typeof reverseGeocodeUtil>
		indicateLoading: Mock<typeof indicateLoading>
		coreStore: Reactive<Record<string, unknown>>
		store: ReturnType<typeof useReverseGeocoderStore>
	}>({
		reverseGeocodeUtil: [
			async ({}, use) => {
				const reverseGeocodeUtil = vi
					.spyOn(reverseGeocodeUtilFile, 'reverseGeocode')
					.mockResolvedValue(null as unknown as ReverseGeocoderFeature)
				await use(reverseGeocodeUtil)
			},
			{ auto: true },
		],
		indicateLoading: [
			async ({}, use) => {
				const indicateLoading = vi
					.spyOn(indicateLoadingFile, 'indicateLoading')
					.mockImplementation(() => () => {})
				await use(indicateLoading)
			},
			{ auto: true },
		],
		coreStore: [
			async ({}, use) => {
				const fit = vi.fn()
				const coreStore = reactive({
					configuration: {
						[PluginId]: {
							url: 'https://wps.example',
							coordinateSources: [{ key: 'coordinateSource' }],
							addressTarget: { key: 'addressTarget' },
							zoomTo: 99,
						},
					},
					map: {
						getView: () => ({ fit }),
					},
					coordinateSource: null,
					addressTarget: null,
				})
				// @ts-expect-error | Mocking useCoreStore
				vi.spyOn(useCoreStoreFile, 'useCoreStore').mockReturnValue(coreStore)
				await use(coreStore)
			},
			{ auto: true },
		],
		store: [
			async ({}, use) => {
				setActivePinia(createPinia())
				const store = useReverseGeocoderStore()
				store.setupPlugin()
				await use(store)
				store.teardownPlugin()
			},
			{ auto: true },
		],
	})
	/* eslint-enable no-empty-pattern */

	test('detects changes in coordinate sources', async ({
		reverseGeocodeUtil,
		coreStore,
	}) => {
		coreStore.coordinateSource = [1, 2]
		await new Promise((resolve) => setTimeout(resolve))
		expect(reverseGeocodeUtil).toHaveBeenCalledWith(
			'https://wps.example',
			[1, 2]
		)
	})

	test('passes geocoding result to address target', async ({
		reverseGeocodeUtil,
		coreStore,
		store,
	}) => {
		const feature = Symbol('feature')
		reverseGeocodeUtil.mockResolvedValueOnce(
			feature as unknown as ReverseGeocoderFeature
		)
		await store.reverseGeocode([3, 4])
		expect(coreStore.addressTarget).toBe(feature)
	})

	test('zooms to input coordinate', async ({
		reverseGeocodeUtil,
		coreStore,
		store,
	}) => {
		const feature = Symbol('feature')
		reverseGeocodeUtil.mockResolvedValueOnce(
			feature as unknown as ReverseGeocoderFeature
		)
		await store.reverseGeocode([3, 4])
		// @ts-expect-error | fit is mocked
		expect(coreStore.map.getView().fit).toHaveBeenCalledOnce()
	})
}

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useReverseGeocoderStore, import.meta.hot)
	)
}
