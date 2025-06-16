import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'
import { ComponentLibrary } from './vuePlugins/kolibri'

export const PolarMap = defineCustomElement(PolarMapCE, {
	configureApp(app) {
		app.use(ComponentLibrary)
	},
})

export function register() {
	customElements.define('polar-map', PolarMap)
}
