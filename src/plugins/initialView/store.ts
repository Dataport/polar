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
		coreStore.map.getView().setCenter(startCenter.value)
		coreStore.map.getView().setResolution(startResolution.value)
	}

	function setupPlugin() {}

	function teardownPlugin() {}

	return {
		startCenter,
		startResolution,

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

let mockCoreStore: unknown

if (import.meta.vitest) {
	const { createPinia, setActivePinia } = await import('pinia')
	const { describe, it, expect, vi, beforeEach } = import.meta.vitest

	const mockView = {
		setCenter: vi.fn(),
		setResolution: vi.fn(),
	}

	vi.mock('@/core/stores', () => ({
		useCoreStore: () => mockCoreStore,
	}))

	const { useInitialViewStore } = await import('./store')

	describe('InitialView Store', () => {
		beforeEach(() => {
			setActivePinia(createPinia())
			vi.clearAllMocks()
			mockCoreStore = {
				map: {
					getView: vi.fn(() => mockView),
				},
				configuration: {
					startCenter: [10, 20],
					startResolution: 2,
				},
			}
		})

		it('should call setCenter and setResolution on returnToInitialView', () => {
			const store = useInitialViewStore()
			store.returnToInitialView()
			expect(mockView.setCenter).toHaveBeenCalledWith([10, 20])
			expect(mockView.setResolution).toHaveBeenCalledWith(2)
		})
	})
}
