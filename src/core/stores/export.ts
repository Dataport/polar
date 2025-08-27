/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from './main'
import { usePluginStore } from './plugin'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Core store of POLAR.
 */
/* eslint-enable tsdoc/syntax */
export const useCoreStore = defineStore('core', () => {
	const mainStore = useMainStore()
	const pluginStore = usePluginStore()

	return {
		/**
		 * Returns the current runtime configuration.
		 *
		 * @readonly
		 */
		configuration: computed(() => mainStore.configuration),

		/**
		 * Before instantiating the map, all required plugins have to be added. Depending on how you use POLAR, this may
		 * already have been done. Ready-made clients (that is, packages prefixed `@polar/client-`) come with plugins prepared.
		 *
		 * You may add further plugins.
		 *
		 * Please note that the order of certain plugins is relevant when other plugins are referenced,
		 * e.g. `@polar/plugin-gfi`'s `coordinateSources` requires the configured sources to have previously been set up.
		 *
		 * In case you're integrating new plugins, call `addPlugin` with a plugin instance.
		 *
		 * @example
		 * ```
		 * addPlugin(Plugin(pluginOptions: PluginOptions))
		 * ```
		 *
		 * @remarks
		 * In case you're writing a new plugin, it must fulfill the following API:
		 * ```
		 * const Plugin = (options: PluginOptions): PluginContainer => ({
		 * 	id,
		 * 	component,
		 * 	locales,
		 * 	options,
		 * 	storeModule,
		 * })
		 * ```
		 *
		 * @param plugin - Plugin to be added.
		 */
		addPlugin: pluginStore.addPlugin,

		removePlugin: pluginStore.removePlugin,

		/**
		 * Returns a plugin's store by its ID.
		 *
		 * For bundled plugins, the return value is typed.
		 *
		 * If no plugin with the specified ID is loaded, `null` is returned instead.
		 */
		getPluginStore: pluginStore.getPluginStore,

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
