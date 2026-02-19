/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import type { Feature } from 'ol'

import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed } from 'vue'

import { updateSelection } from '../utils/map/setupMarkers'
import { useMainStore } from './main'
import { useMarkerStore } from './marker'
import { useMoveHandleStore } from './moveHandle'
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
	const mainStoreRefs = storeToRefs(mainStore)

	const moveHandleStore = useMoveHandleStore()

	const pluginStore = usePluginStore()

	const markerStore = useMarkerStore()
	const markerStoreRefs = storeToRefs(markerStore)

	return {
		/**
		 * Read or modify center coordinate of the map.
		 *
		 * @internal
		 */
		center: mainStoreRefs.center,

		/**
		 * Color scheme the client should be using.
		 *
		 * @internal
		 */
		colorScheme: mainStoreRefs.colorScheme,

		/**
		 * The current height of the map.
		 *
		 * @alpha
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
		 * @alpha
		 * @readonly
		 */
		deviceIsHorizontal: computed(() => mainStore.deviceIsHorizontal),

		/**
		 * Extent of the map.
		 *
		 * @alpha
		 * @readonly
		 */
		extent: computed(() => mainStore.extent),

		/**
		 * Whether the map has a maximum height of {@link SMALL_DISPLAY_HEIGHT} and
		 * a maximum width of {@link SMALL_DISPLAY_WIDTH}.
		 *
		 * @alpha
		 * @readonly
		 */
		hasSmallDisplay: computed(() => mainStore.hasSmallDisplay),

		/**
		 * Whether the height of the map is smaller than 480px.
		 *
		 * @alpha
		 * @readonly
		 */
		hasSmallHeight: computed(() => mainStore.hasSmallHeight),

		/**
		 * Whether the width of the map is smaller than 768px.
		 *
		 * @alpha
		 * @readonly
		 */
		hasSmallWidth: computed(() => mainStore.hasSmallWidth),

		/**
		 * Whether the size of the map equals the size of the browser window.
		 *
		 * @alpha
		 * @readonly
		 */
		hasWindowSize: computed(() => mainStore.hasWindowSize),

		/**
		 * Configured language.
		 *
		 * @internal
		 */
		language: mainStoreRefs.language,

		/**
		 * Current zoom level of the map.
		 *
		 * @alpha
		 */
		zoom: mainStoreRefs.zoom,

		/**
		 * Returns the layer with the given ID.
		 *
		 * @param layerId - ID of the layer
		 * @alpha
		 */
		getLayer: mainStore.getLayer,

		/**
		 * List of all active plugin's IDs.
		 *
		 * @readonly
		 * @alpha
		 */
		activePluginIds: computed(() => pluginStore.activePluginIds),

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

		/**
		 * Removes a plugin by its ID.
		 *
		 * @param pluginId - ID of the plugin to be removed.
		 */
		removePlugin: pluginStore.removePlugin,

		/**
		 * Returns a plugin's store by its ID.
		 *
		 * For bundled plugins, the return value is typed.
		 *
		 * If no plugin with the specified ID is loaded, `null` is returned instead.
		 *
		 * @param pluginId - ID of the plugin whose store is requested.
		 */
		getPluginStore: pluginStore.getPluginStore,

		/**
		 * Allows reading or setting the OIDC token used for service accesses.
		 */
		oidcToken: mainStoreRefs.oidcToken,

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
		 * The current top position value in px of the MoveHandle.
		 * Is null if the MoveHandle is currently not visible.
		 *
		 * @readonly
		 * @alpha
		 */
		moveHandleTop: computed(() => moveHandleStore.top),

		/**
		 * Feature that is hovered by the user with a marker.
		 * NOTE: Set _polarLayerId!
		 *
		 * @alpha
		 */
		hoveredFeature: markerStoreRefs.hovered,

		/**
		 * Feature that was selected by the user with a marker.
		 *
		 * @alpha
		 */
		selectedFeature: computed({
			get: () => markerStore.selected,
			set: (feature) => {
				updateSelection(mainStore.map, feature as Feature)
			},
		}),

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

		/**
		 * Allows setting content to the MoveHandle to be displayed on small devices
		 * if the application has the same size as the window.
		 *
		 * @alpha
		 */
		setMoveHandle: moveHandleStore.setMoveHandle,

		/**
		 * Allows setting an additional action button to be displayed as part of the
		 * MoveHandle.
		 *
		 * @alpha
		 */
		setMoveHandleActionButton: moveHandleStore.setMoveHandleActionButton,
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCoreStore, import.meta.hot))
}
