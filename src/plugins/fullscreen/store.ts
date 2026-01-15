/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/fullscreen/store
 */
/* eslint-enable tsdoc/syntax */

import type { Reactive } from 'vue'

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId, type FullscreenPluginOptions } from './types'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for fullscreen mode detection and enablement.
 */
/* eslint-enable tsdoc/syntax */
export const useFullscreenStore = defineStore('plugins/fullscreen', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as FullscreenPluginOptions
	)
	const renderType = computed(() => configuration.value.renderType)

	const targetContainer = computed(() => {
		if (typeof configuration.value.targetContainer === 'string') {
			return (
				document.getElementById(configuration.value.targetContainer) ||
				document.documentElement
			)
		}
		if (!configuration.value.targetContainer) {
			return coreStore.lightElement || document.documentElement
		}
		return configuration.value.targetContainer
	})

	const _fullscreenEnabled = ref(false)
	const simulatedFullscreenSavedStyle = ref<string | null>(null)

	function enableSimulatedFullscreen() {
		if (!coreStore.lightElement) {
			return
		}

		simulatedFullscreenSavedStyle.value = coreStore.lightElement.style.cssText

		coreStore.lightElement.style.position = 'fixed'
		coreStore.lightElement.style.margin = '0'
		coreStore.lightElement.style.top = '0'
		coreStore.lightElement.style.left = '0'
		coreStore.lightElement.style.width = '100%'
		coreStore.lightElement.style.height = '100%'
		coreStore.lightElement.style.zIndex = '9999'
	}

	async function enableFullscreen() {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!targetContainer.value.requestFullscreen) {
			// @ts-expect-error | WebKit is still needed for iOS Safari
			if (targetContainer.value.webkitRequestFullscreen) {
				// @ts-expect-error | WebKit is still needed for iOS Safari
				await targetContainer.value.webkitRequestFullscreen()
				updateFullscreenState()
				return
			}

			// Fallback to simulated fullscreen
			enableSimulatedFullscreen()
			return
		}

		await targetContainer.value.requestFullscreen()
		updateFullscreenState()
	}

	async function disableFullscreen() {
		if (simulatedFullscreenSavedStyle.value !== null) {
			if (coreStore.lightElement) {
				coreStore.lightElement.style.cssText =
					simulatedFullscreenSavedStyle.value
			}
			simulatedFullscreenSavedStyle.value = null
			return
		}

		// @ts-expect-error | WebKit is still needed for iOS Safari
		if (document.webkitExitFullscreen) {
			// @ts-expect-error | WebKit is still needed for iOS Safari
			await document.webkitExitFullscreen()
			updateFullscreenState()
			return
		}

		await document.exitFullscreen()
		updateFullscreenState()
	}

	const fullscreenEnabled = computed({
		get: () =>
			simulatedFullscreenSavedStyle.value !== null || _fullscreenEnabled.value,
		set: (value) => {
			;(value ? enableFullscreen : disableFullscreen)().catch(() => {
				console.warn('Failed to toggle fullscreen mode')
			})
		},
	})

	function updateFullscreenState() {
		_fullscreenEnabled.value =
			// @ts-expect-error | WebKit is still needed for iOS Safari
			Boolean(document.fullscreenElement || document.webkitFullscreenElement)
	}

	function setupPlugin() {
		addEventListener('fullscreenchange', updateFullscreenState)
		addEventListener('webkitfullscreenchange', updateFullscreenState)
	}

	function teardownPlugin() {
		removeEventListener('fullscreenchange', updateFullscreenState)
		removeEventListener('webkitfullscreenchange', updateFullscreenState)
	}

	return {
		/**
		 * Reading this property describes if fullscreen mode is enabled or disabled.
		 * Writing this property enables or disables fullscreen mode, respectively.
		 *
		 * @defaultValue false
		 */
		fullscreenEnabled,

		/**
		 * Enable simulated fullscreen mode (without using the Fullscreen API).
		 * This is usually not necessary to call manually, as the plugin handles it automatically
		 * if the Fullscreen API is not available.
		 *
		 * @alpha
		 */
		enableSimulatedFullscreen,

		/** @internal */
		renderType,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.vitest) {
	const { expect, test: _test, vi } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')
	const { reactive } = await import('vue')
	const useCoreStoreFile = await import('@/core/stores')

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		coreStore: Reactive<Record<string, unknown>>
		store: ReturnType<typeof useFullscreenStore>
	}>({
		coreStore: [
			async ({}, use) => {
				const coreStore = reactive({
					configuration: { [PluginId]: {} },
				})
				// @ts-expect-error | Mocking useCoreStore
				vi.spyOn(useCoreStoreFile, 'useCoreStore').mockReturnValue(coreStore)
				await use(coreStore)
			},
			{ auto: true },
		],
		store: async ({}, use) => {
			setActivePinia(createPinia())
			const store = useFullscreenStore()
			store.setupPlugin()
			await use(store)
			store.teardownPlugin()
		},
	})
	/* eslint-enable no-empty-pattern */

	test.for([
		{ native: true, webkit: true, result: true },
		{ native: true, webkit: false, result: true },
		{ native: false, webkit: true, result: true },
		{ native: false, webkit: false, result: false },
	])(
		'Fullscreen detection uses webkit prefix if necessary (native=$native, webkit=$webkit)',
		({ native, webkit, result }, { store }) => {
			jsdom.window.document.fullscreenElement = native
			jsdom.window.document.webkitFullscreenElement = webkit
			dispatchEvent(new Event('fullscreenchange'))
			expect(store.fullscreenEnabled).toBe(result)
		}
	)

	test.for([
		{ native: true, webkit: true },
		{ native: true, webkit: false },
		{ native: false, webkit: true },
	])(
		'Enable fullscreen uses webkit prefix if necessary (native=$native, webkit=$webkit)',
		async ({ native, webkit }, { store, coreStore }) => {
			jsdom.window.document.fullscreenElement = null
			const requestFullscreen = vi.fn(() => {
				return new Promise<void>((resolve) => {
					jsdom.window.document.fullscreenElement =
						document.createElement('div')
					resolve()
				})
			})
			coreStore.lightElement = {
				...(native ? { requestFullscreen } : {}),
				...(webkit ? { webkitRequestFullscreen: requestFullscreen } : {}),
			}
			store.fullscreenEnabled = true
			expect(requestFullscreen).toHaveBeenCalled()
			await vi.waitUntil(() => store.fullscreenEnabled)
			expect(store.fullscreenEnabled).toBeTruthy()
		}
	)

	test.for([
		{ native: true, webkit: true },
		{ native: true, webkit: false },
		{ native: false, webkit: true },
	])(
		'Disable fullscreen uses webkit prefix if necessary (native=$native, webkit=$webkit)',
		async ({ native, webkit }, { store }) => {
			jsdom.window.document.fullscreenElement = document.createElement('div')
			dispatchEvent(new Event('fullscreenchange'))
			const exitFullscreen = vi.fn(() => {
				return new Promise<void>((resolve) => {
					jsdom.window.document.fullscreenElement = null
					resolve()
				})
			})
			if (native) {
				jsdom.window.document.exitFullscreen = exitFullscreen
			}
			if (webkit) {
				jsdom.window.document.webkitExitFullscreen = exitFullscreen
			}
			store.fullscreenEnabled = false
			expect(exitFullscreen).toHaveBeenCalled()
			await vi.waitUntil(() => !store.fullscreenEnabled)
			expect(store.fullscreenEnabled).toBeFalsy()
			delete jsdom.window.document.exitFullscreen
			delete jsdom.window.document.webkitExitFullscreen
		}
	)

	test('Enable simulated fullscreen if Fullscreen API is not available', ({
		store,
		coreStore,
	}) => {
		const style = new CSSStyleDeclaration()
		coreStore.lightElement = { style }
		style.cssText = 'position: relative; width: 400px; height: 300px;'
		store.fullscreenEnabled = true
		expect(store.fullscreenEnabled).toBeTruthy()
		expect(style.position).toBe('fixed')
		store.fullscreenEnabled = false
		expect(store.fullscreenEnabled).toBeFalsy()
		expect(style.position).toBe('relative')
	})
}

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFullscreenStore, import.meta.hot))
}
