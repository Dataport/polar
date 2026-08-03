import { defineStore } from 'pinia'
import { computed } from 'vue'

import { useCoreStore } from '@/core/stores'

export const useInitialViewStore = defineStore('plugins/initialView', () => {
	const coreStore = useCoreStore()

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
		startCenter,
		startResolution,

		/** @alpha  */
		returnToInitialView,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
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
