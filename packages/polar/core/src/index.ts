import { defineCustomElement } from 'vue'
import defu from 'defu'
import PolarMapCE from './components/PolarMap.ce.vue'
import { loadKoliBri } from './utils/loadKoliBri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'

/**
 * Registers the custom element for the polar map.
 *
 * @param options.tagName - Tag name for the custom element (defaults to `polar-map`)
 * @param options.externalKoliBri - Re-use theme and implementation of KoliBri in the outer application
 */
export async function register(options: {
	tagName?: string,
	externalKoliBri?: boolean,
} = {}) {
	options = defu(options, {
		tagName: 'polar-map',
		externalKoliBri: false,
	})

	await loadKoliBri(options.tagName)

	const PolarMap = defineCustomElement(PolarMapCE, {
		configureApp(app) {
			app.use(I18Next, options)
			app.use(Pinia, options)
		},
	})
	customElements.define(options.tagName, PolarMap)
}
