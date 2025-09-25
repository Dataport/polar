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
import { useMoveHandleStore } from './moveHandle'

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Core store of POLAR.
 */
/* eslint-enable tsdoc/syntax */
export const useCoreStore = defineStore('core', () => {
	const mainStore = useMainStore()
	const moveHandleStore = useMoveHandleStore()

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
