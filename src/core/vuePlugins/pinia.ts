import type { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { saveInstance } from '../piniaPlugins/saveInstance'
import { actionLogger } from '../piniaPlugins/actionLogger'

export const Pinia: Plugin = {
	install(app) {
		const pinia = createPinia()
		pinia.use(saveInstance)
		pinia.use(actionLogger)
		app.use(pinia)
	},
}
