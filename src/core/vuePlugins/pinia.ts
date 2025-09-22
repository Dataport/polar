import type { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { actionLogger } from '../piniaPlugins/actionLogger'

export const Pinia: Plugin = {
	install(app) {
		const pinia = createPinia()
		pinia.use(actionLogger)
		app.use(pinia)
	},
}
