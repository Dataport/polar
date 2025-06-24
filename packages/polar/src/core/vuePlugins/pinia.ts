import type { Plugin } from 'vue'
import { createPinia } from 'pinia'

export const Pinia: Plugin = {
	install(app) {
		const pinia = createPinia()
		app.use(pinia)
	},
}
