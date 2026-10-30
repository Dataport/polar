/**
 * This is the main export for the NPM package \@polar/polar.
 *
 * Lost? You probably want to start at {@link createMap}.
 *
 * @packageDocumentation
 * @module \@polar/polar
 */

import type { PolarMapInstance } from './components/polarMapInstance'

import { defineCustomElement } from 'vue'

import PolarContainer from './components/PolarContainer.vue'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import './monkeyHeaderLoader'

// Augment global namespace
declare global {
	// Interface mapping dom elements to interfaces; https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#documentcreateelement
	interface HTMLElementTagNameMap {
		/* eslint-disable @typescript-eslint/naming-convention */
		/**
		 * This declaration lets `document.createElement('polar-map')` and `document.querySelector('polar-map')`
		 * resolve to `PolarMapInstance` without a cast.
		 *
		 * @remarks
		 * The element only behaves as typed once the function `register` has
		 * defined the custom element.
		 */
		'polar-map': PolarMapInstance
		/* eslint-enable @typescript-eslint/naming-convention */
	}
}

/**
 * Custom element of the POLAR map.
 */
export const PolarMap = defineCustomElement(PolarContainer, {
	configureApp(app) {
		app.use(Pinia)
		app.use(I18Next)
	},
})

/**
 * Registers the custom element for POLAR (i.e., `polar-map`).
 *
 * This has to be called before using POLAR in any way.
 */
export function register() {
	customElements.define('polar-map', PolarMap)
}

export { fetchServiceRegister } from './utils/fetchServiceRegister'
export * from './utils/export/createMap'
export * from './utils/export/plugin'
export * from './utils/export/store'

export type * from './types'
export type { PolarMapInstance }
