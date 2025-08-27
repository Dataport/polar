/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import type {
	PluginId,
	BundledPluginId,
	BundledPluginStores,
	PolarPluginStore,
} from '../types'
import { useMainStore } from './main'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Core store of POLAR.
 */
/* eslint-enable tsdoc/syntax */
export const useCoreStore = defineStore('core', () => {
	const mainStore = useMainStore()

	function getPluginStore<T extends PluginId>(
		id: T
	): ReturnType<
		T extends BundledPluginId
			? BundledPluginStores<typeof id>
			: PolarPluginStore
	> | null {
		const plugin = mainStore.plugins.find((plugin) => plugin.id === id)
		// @ts-expect-error | We trust that our internal IDs work.
		return plugin?.storeModule?.() || null
	}

	return {
		/**
		 * Returns the current runtime configuration.
		 *
		 * @readonly
		 */
		configuration: computed(() => mainStore.configuration),

		/**
		 * Returns a plugin's store by its ID.
		 *
		 * For bundled plugins, the return value is typed.
		 *
		 * If no plugin with the specified ID is loaded, `null` is returned instead.
		 */
		getPluginStore,

		/**
		 * Allows reading or setting the OIDC token used for service accesses.
		 */
		oidcToken: mainStore.oidcToken,

		/**
		 * Allows accessing the POLAR DOM element (`<polar-map>`).
		 *
		 * @readonly
		 * @alpha
		 */
		lightElement: computed(() => mainStore.lightElement),

		/**
		 * The currently used layout.
		 * Either a string indicating `standard` or `nineRegions` or a custom Vue component.
		 *
		 * @readonly
		 * @alpha
		 */
		layout: mainStore.layout,

		/**
		 * Allows accessing the OpenLayers Map element.
		 *
		 * @readonly
		 * @alpha
		 */
		map: computed(() => mainStore.map),

		/**
		 * Allows accessing the Shadow DOM root of POLAR.
		 *
		 * @readonly
		 * @alpha
		 */
		shadowRoot: computed(() => mainStore.shadowRoot),
	}
})
