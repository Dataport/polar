import type { PiniaPluginContext } from 'pinia'

export function actionLogger({ store }: PiniaPluginContext) {
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
