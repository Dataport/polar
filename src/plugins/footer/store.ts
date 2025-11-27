/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/footer/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'
import type { PluginContainer } from '@/core'
import { useCoreStore } from '@/core/stores/export'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the footer.
 */
/* eslint-enable tsdoc/syntax */
export const useFooterStore = defineStore('plugins/footer', () => {
	const coreStore = useCoreStore()

	const leftEntries = ref<PluginContainer[]>([])
	const rightEntries = ref<PluginContainer[]>([])

	function setupPlugin() {
		leftEntries.value = (
			coreStore.configuration.footer?.leftEntries || []
		).filter(({ id }) => {
			const display = coreStore.configuration[id]?.displayComponent
			return typeof display === 'boolean' ? display : true
		})
		rightEntries.value = (
			coreStore.configuration.footer?.rightEntries || []
		).filter(({ id }) => {
			const display = coreStore.configuration[id]?.displayComponent
			return typeof display === 'boolean' ? display : true
		})
	}

	function teardownPlugin() {}

	return {
		/** @internal */
		leftEntries,

		/** @internal */
		rightEntries,

		/** @internal */
		setupPlugin,

		/** @internal */
		teardownPlugin,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useFooterStore, import.meta.hot))
}
