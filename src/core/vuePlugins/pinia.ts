import type { Plugin } from 'vue'
import { createPinia, type PiniaPluginContext } from 'pinia'

function actionLogger({ store }: PiniaPluginContext) {
	if (import.meta.env.DEV) {
		/* eslint-disable no-console */
		console.log('DEV MODE DETECTED - PINIA LOGGING ENABLED')
		store.$onAction(
			({ name, store, args }) => {
				console.log(
					`Action: '${name}'; Store: '${store.$id}'; Arguments:`,
					args
				)
			}
			/* eslint-enable no-console */
		)
	}
}

export const Pinia: Plugin = {
	install(app) {
		const pinia = createPinia()
		pinia.use(actionLogger)
		app.use(pinia)
	},
}
