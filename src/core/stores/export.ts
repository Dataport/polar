/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
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
		configuration: mainStore.configuration,

		/**
		 * Allows reading or setting the OIDC token used for service accesses.
		 */
		oidcToken: mainStore.oidcToken,

		/**
		 * Allows accessing the POLAR DOM element (`<polar-map>`).
		 *
		 * @alpha
		 */
		lightElement: mainStore.lightElement,

		/**
		 * Allows accessing the Shadow DOM root of POLAR.
		 *
		 * @alpha
		 */
		shadowRoot: mainStore.shadowRoot,
	}
})
