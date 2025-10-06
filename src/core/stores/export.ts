/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import { useMainStore } from './main'
import { usePluginStore } from './plugin'
import { useMarkerStore } from './marker'

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
	const markerStore = useMarkerStore()

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
		 * Configured language.
		 *
		 * @internal
		 */
		language: computed({
			get: () => mainStore.language,
			set: (value) => {
				mainStore.language = value
			},
		}),

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
		 * Coordinates that were selected by the user with a marker.
		 *
		 * @readonly
		 * @alpha
		 */
		selectedCoordinates: computed(() => markerStore.selectedCoordinates),

		/**
		 * Allows accessing the Shadow DOM root of POLAR.
		 *
		 * @readonly
		 * @alpha
		 */
		shadowRoot: computed(() => mainStore.shadowRoot),
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCoreStore, import.meta.hot))
}
