import * as mpapi from '@masterportal/masterportalapi'
import { defineCustomElement } from 'vue'

export function register() {
	const PolarMapElement = defineCustomElement({
		props: {},
		emits: {},
		template: `POLAR map boilerplate`,
		styles: [`/* inlined css */`]
	})
	customElements.define('polar-map', PolarMapElement)
}
