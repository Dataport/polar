import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { ComponentLibrary } from './vuePlugins/kolibri'
import { I18Next } from './vuePlugins/i18next'
import { Pinia } from './vuePlugins/pinia'

export const PolarMap = defineCustomElement(PolarMapCE, {
	configureApp (app) {
		app.use(ComponentLibrary)
		app.use(I18Next)
		app.use(Pinia)
	},
})

export function register () {
	customElements.define('polar-map', PolarMap)
}
