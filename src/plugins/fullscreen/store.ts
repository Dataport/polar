/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/fullscreen/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Reactive } from 'vue'
import { PluginId, type FullscreenPluginOptions } from './types'
import { useCoreStore } from '@/core/stores/export'

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

	async function enableFullscreen() {
		// @ts-expect-error | WebKit is still needed for iOS Safari
		if (targetContainer.value.webkitRequestFullscreen) {
			// @ts-expect-error | WebKit is still needed for iOS Safari
			await targetContainer.value.webkitRequestFullscreen()
			updateFullscreenState()
			return
		}

		await targetContainer.value.requestFullscreen()
		updateFullscreenState()
	}

	async function disableFullscreen() {
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
		get: () => _fullscreenEnabled.value,
		set: (value) => {
			if (value === _fullscreenEnabled.value) {
				return
			}
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

	const mockedUseCoreStore = vi.hoisted(() => vi.fn())
	vi.mock('@/core/stores/export', () => ({
		useCoreStore: mockedUseCoreStore,
	}))

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
				mockedUseCoreStore.mockReturnValue(coreStore)
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
}

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFullscreenStore, import.meta.hot))
}
