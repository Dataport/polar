/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/footer/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { type Component, markRaw, ref } from 'vue'
import { toMerged } from 'es-toolkit'
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
		leftEntries.value.concat(rightEntries.value).forEach((plugin) => {
			coreStore.addPlugin(toMerged(plugin, { independent: false }))
		})
		// Otherwise, the component itself is made reactive
		leftEntries.value.map((plugin) =>
			toMerged(plugin, { component: markRaw(plugin.component as Component) })
		)
		rightEntries.value.map((plugin) =>
			toMerged(plugin, { component: markRaw(plugin.component as Component) })
		)
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
