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
		 * The current height of the map.
		 *
		 * @internal
		 * @readonly
		 */
		clientHeight: computed(() => mainStore.clientHeight),

		/**
		 * Returns the current runtime configuration.
		 *
		 * @readonly
		 */
		configuration: computed(() => mainStore.configuration),

		/**
		 * Whether a mobile device is held horizontally.
		 * True if {@link hasSmallHeight} and {@link hasWindowSize} are true.
		 *
		 * @internal
		 * @readonly
		 */
		deviceIsHorizontal: computed(() => mainStore.deviceIsHorizontal),

		/**
		 * Whether the height of the map is smaller than 480px.
		 *
		 * @internal
		 * @readonly
		 */
		hasSmallHeight: computed(() => mainStore.hasSmallHeight),

		/**
		 * Whether the width of the map is smaller than 768px.
		 *
		 * @internal
		 * @readonly
		 */
		hasSmallWidth: computed(() => mainStore.hasSmallWidth),

		/**
		 * Whether the size of the map equals the size of the browser window.
		 *
		 * @internal
		 * @readonly
		 */
		hasWindowSize: computed(() => mainStore.hasWindowSize),

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
		layout: computed(() => mainStore.layout),

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
