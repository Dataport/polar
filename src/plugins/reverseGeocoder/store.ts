/**
 * @module \@polar/polar/plugins/reverseGeocoder/store
 */

import type { Mock } from 'vitest'
import type { Reactive } from 'vue'
import type {
	ReverseGeocoderFeature,
	ReverseGeocoderPluginOptions,
} from './types'

import { easeOut } from 'ol/easing'
import { Point } from 'ol/geom'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw } from 'vue'

import { useRefStore } from '@/composables/useRefStore'
import { useStoreWatcher } from '@/composables/useStoreWatcher'
import { useCoreStore } from '@/core/stores'
import { indicateLoading } from '@/lib/indicateLoading'

import { PluginId } from './types'
import { reverseGeocodeNominatim } from './utils/reverseGeocodeNominatim'
import {
	addressMissingMessage,
	reverseGeocodeWps,
} from './utils/reverseGeocodeWps'

/**
 * @function
 *
 * Plugin store for reverse geocoder that converts coordinates into addresses.
 */

export const useReverseGeocoderStore = defineStore(
	'plugins/reverseGeocoder',
	() => {
		const coreStore = useCoreStore()

		const abortController = ref<AbortController | null>(null)

		const configuration = computed(
			() => coreStore.configuration[PluginId] as ReverseGeocoderPluginOptions
		)

		useStoreWatcher(
			() => configuration.value.coordinateSources || [],
			async (value, _source, { loopDetected }) => {
				const coordinate = value as [number, number] | null
				if (coordinate) {
					// On a loop, only forward the address.
					await resolveAddress(coordinate, {
						forwardToAddressTarget: true,
						zoom: !loopDetected,
					})
				}
			},
			{
				immediate: true,
				target: configuration.value.addressTarget,
				invokeOnLoop: configuration.value.forwardOriginatingChanges,
			}
		)

		function setupPlugin() {}

		function teardownPlugin() {}

		function passFeatureToTarget(
			target: NonNullable<ReverseGeocoderPluginOptions['addressTarget']>,
			feature: ReverseGeocoderFeature
		) {
			const targetStore = useRefStore(target)
			if (!targetStore) {
				return
			}
			targetStore[target.key](feature)
		}

		async function reverseGeocode(
			coordinate: [number, number],
			forwardToAddressTarget = true
		) {
			return resolveAddress(coordinate, {
				forwardToAddressTarget,
				zoom: forwardToAddressTarget,
			})
		}

		async function resolveAddress(
			coordinate: [number, number],
			{
				forwardToAddressTarget,
				zoom,
			}: { forwardToAddressTarget: boolean; zoom: boolean }
		) {
			const finish = indicateLoading()
			if (abortController.value) {
				abortController.value.abort()
				abortController.value = null
			}
			abortController.value = new AbortController()
			const signal = toRaw(abortController.value.signal)
			try {
				const reverseGeocodeUtil = {
					wps: (params) =>
						reverseGeocodeWps({
							...params,
							serviceEpsg: configuration.value.epsg || 'EPSG:25832',
						}),
					nominatim: reverseGeocodeNominatim,
				}[configuration.value.type]
				const feature = await reverseGeocodeUtil({
					url: configuration.value.url,
					coordinate,
					epsg: coreStore.configuration.epsg,
					signal,
				})
				if (configuration.value.addressTarget && forwardToAddressTarget) {
					passFeatureToTarget(configuration.value.addressTarget, feature)
				}
				if (configuration.value.zoomTo && zoom) {
					coreStore.map.getView().fit(new Point(coordinate), {
						maxZoom: configuration.value.zoomTo,
						duration: 400,
						easing: easeOut,
					})
				}
				return feature
			} catch (error) {
				if (!signal.aborted) {
					if (
						error instanceof Error &&
						error.message === addressMissingMessage
					) {
						console.warn(
							`Reverse geocoding stopped with message '${addressMissingMessage}'. This indicates the WPS does not support this region.`
						)
					} else {
						console.error('Reverse geocoding failed:', error)
					}
				}
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
			abortController,

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
	const useCoreStoreFile = await import('@/core/stores')
	const useStoreWatcherFile = await import('@/composables/useStoreWatcher')
	const reverseGeocodeUtilFile = await import('./utils/reverseGeocodeWps')
	const indicateLoadingFile = await import('@/lib/indicateLoading')

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		forwardOriginatingChanges: boolean
		storeWatcher: Mock<typeof useStoreWatcher>
		reverseGeocodeUtil: Mock<typeof reverseGeocodeWps>
		indicateLoading: Mock<typeof indicateLoading>
		coreStore: Reactive<Record<string, unknown>>
		store: ReturnType<typeof useReverseGeocoderStore>
	}>({
		forwardOriginatingChanges: false,
		storeWatcher: [
			async ({}, use) => {
				await use(vi.spyOn(useStoreWatcherFile, 'useStoreWatcher'))
			},
			{ auto: true },
		],
		reverseGeocodeUtil: [
			async ({}, use) => {
				const reverseGeocodeUtil = vi
					.spyOn(reverseGeocodeUtilFile, 'reverseGeocodeWps')
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
			async ({ forwardOriginatingChanges }, use) => {
				const fit = vi.fn()
				const pluginStores = {
					pins: reactive({
						coordinate: null,
					}),
				}
				const coreStore = reactive({
					configuration: {
						epsg: 'EPSG:25832',
						[PluginId]: {
							type: 'wps',
							url: 'https://wps.example',
							coordinateSources: [{ plugin: 'pins', key: 'coordinate' }],
							addressTarget: { key: 'addressTarget' },
							zoomTo: 99,
							forwardOriginatingChanges,
						},
					},
					map: {
						getView: () => ({ fit }),
					},
					addressTarget: vi.fn(),
					getPluginStore: (plugin) => pluginStores[plugin] || null,
				})
				// @ts-expect-error | Mocking useCoreStore
				vi.spyOn(useCoreStoreFile, 'useCoreStore').mockReturnValue(coreStore)
				await use({ ...coreStore, pluginStores })
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
		store,
	}) => {
		const pluginStore = coreStore.pluginStores as {
			pins: {
				coordinate: [number, number] | null
			}
		}
		pluginStore.pins.coordinate = [1, 2]
		await new Promise((resolve) => setTimeout(resolve))
		expect(reverseGeocodeUtil).toHaveBeenCalledExactlyOnceWith({
			url: 'https://wps.example',
			coordinate: [1, 2],
			epsg: 'EPSG:25832',
			serviceEpsg: 'EPSG:25832',
			signal: store.abortController?.signal,
		})
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
		expect(coreStore.addressTarget).toHaveBeenCalledExactlyOnceWith(feature)
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

	test('skips loops by default', ({ storeWatcher }) => {
		expect(storeWatcher.mock.calls[0]?.[2]?.invokeOnLoop).toBeFalsy()
	})

	test.extend({ forwardOriginatingChanges: true })(
		'handles loops if forwardOriginatingChanges is set',
		({ storeWatcher }) => {
			expect(storeWatcher.mock.calls[0]?.[2]?.invokeOnLoop).toBe(true)
		}
	)

	test('only forwards the address on a loop', async ({
		reverseGeocodeUtil,
		coreStore,
		storeWatcher,
	}) => {
		const feature = Symbol('feature')
		reverseGeocodeUtil.mockResolvedValueOnce(
			feature as unknown as ReverseGeocoderFeature
		)
		const callback = storeWatcher.mock.calls[0]?.[1]
		await callback?.(
			[5, 6],
			{ plugin: 'pins', key: 'coordinate' },
			{ loopDetected: true }
		)
		expect(coreStore.addressTarget).toHaveBeenCalledExactlyOnceWith(feature)
		// @ts-expect-error | fit is mocked
		expect(coreStore.map.getView().fit).not.toHaveBeenCalled()
	})
}

if (import.meta.hot) {
	import.meta.hot.accept(
		acceptHMRUpdate(useReverseGeocoderStore, import.meta.hot)
	)
}
