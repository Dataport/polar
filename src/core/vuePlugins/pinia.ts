import type { Plugin } from 'vue'

import { createPinia } from 'pinia'

import { actionLogger } from '../piniaPlugins/actionLogger'
import { saveInstance } from '../piniaPlugins/saveInstance'

export const Pinia: Plugin = {
	install(app) {
		const pinia = createPinia()
		pinia.use(saveInstance)
		pinia.use(actionLogger)
		app.use(pinia)
	},
}
