/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed } from 'vue'
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

	return {
		/**
		 * Returns the current runtime configuration.
		 *
		 * @readonly
		 */
		configuration: computed(() => mainStore.configuration),

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
