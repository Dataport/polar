import * as mpapi from '@masterportal/masterportalapi'
import PolarMap from '../components/PolarMap.ce.vue'
import { defineCustomElement } from 'vue'

export function registerCustomElement() {
	const PolarMapElement = defineCustomElement(PolarMap)
	customElements.define('polar-map', PolarMapElement)
}
