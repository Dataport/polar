import type { ComputedRef } from 'vue'
import type { InitialViewPluginOptions } from './types'

import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

import { PluginId } from './types'

export const useInitialViewStore = defineStore('plugins/initialView', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as InitialViewPluginOptions
	)

	const layoutTag = computed(() => configuration.value.layoutTag ?? '')

	const renderType = computed(
		() => configuration.value.renderType ?? 'independent'
	)

	const tooltipPosition = computed(() =>
		renderType.value === 'independent'
			? layoutTag.value.includes('RIGHT')
				? 'left'
				: 'right'
			: coreStore.getPluginStore('iconMenu')?.layoutTag.includes('RIGHT')
				? 'left'
				: 'right'
	) as ComputedRef<'left' | 'right'>

	const startCenter = computed(() => coreStore.configuration.startCenter)

	const startResolution = computed(
		() => coreStore.configuration.startResolution
	)

	function returnToInitialView() {
		coreStore.center = startCenter.value
		const zoom = coreStore.configuration.options.find(
			({ resolution }) => resolution === startResolution.value
		)
		if (zoom) {
			coreStore.zoom = zoom.zoomLevel
		}
	}

	function setupPlugin() {}

	function teardownPlugin() {}

	return {
		/** @alpha  */
		returnToInitialView,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,

		/**
		 * Indicates in which direction of the element space is available for a tooltip.
		 *
		 * @alpha
		 * @readonly
		 */
		tooltipPosition,
	}
})

if (import.meta.vitest) {
	const { createPinia, setActivePinia } = await import('pinia')
	const { describe, it, expect, vi, beforeEach } = import.meta.vitest
	const useCoreStoreFile = await import('@/core/stores')

	interface MockCoreStore {
		center: number[] | null
		configuration: {
			startCenter: number[]
			startResolution: number
			options: { resolution: number; zoomLevel: number }[]
		}
		getPluginStore: () => unknown
		zoom: number | null
	}

	let mockCoreStore: MockCoreStore

	const mockOptions = [
		{ resolution: 1, zoomLevel: 5 },
		{ resolution: 2, zoomLevel: 10 },
		{ resolution: 3, zoomLevel: 15 },
	]

	beforeEach(() => {
		setActivePinia(createPinia())
		mockCoreStore = {
			configuration: {
				startCenter: [10, 20],
				startResolution: 2,
				options: mockOptions,
			},
			center: null,
			zoom: null,
			getPluginStore: vi.fn(),
		}
		// @ts-expect-error | Mocking useCoreStore
		vi.spyOn(useCoreStoreFile, 'useCoreStore').mockReturnValue(mockCoreStore)
	})

	const { useInitialViewStore } = await import('./store')

	describe('InitialView Store', () => {
		it('should set center and zoom on returnToInitialView', () => {
			const store = useInitialViewStore()
			store.returnToInitialView()
			expect(mockCoreStore.center).toEqual([10, 20])
			expect(mockCoreStore.zoom).toBe(10)
		})
	})
}
