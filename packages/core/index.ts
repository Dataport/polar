import { defineCustomElement } from 'vue'
import PolarMapCE from './components/PolarMap.ce.vue'

export const PolarMap = defineCustomElement(PolarMapCE)

export function register() {
	customElements.define('polar-map', PolarMap)
}
