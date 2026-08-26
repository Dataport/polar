/* eslint-disable tsdoc/syntax */
/**
 * This is the main export for the NPM package \@polar/polar.
 *
 * Lost? You probably want to start at {@link createMap}.
 *
 * @packageDocumentation
 * @module \@polar/polar
 */
/* eslint-enable tsdoc/syntax */

import { defineCustomElement } from 'vue'

import PolarContainer from './components/PolarContainer.ce.vue'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'
import './monkeyHeaderLoader'

/**
 * Custom element of the POLAR map.
 *
 * You will probably need this to have TypeScript support on `polar-map` elements
 * if you want to do so.
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
export { type PolarContainer }
