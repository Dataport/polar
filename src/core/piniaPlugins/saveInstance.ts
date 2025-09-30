import type { Pinia, PiniaPluginContext } from 'pinia'

export interface PiniaSavedInstance {
	/* eslint-disable @typescript-eslint/naming-convention */
	_instance: Pinia
	/* eslint-enable @typescript-eslint/naming-convention */
}

export function saveInstance({ pinia, store }: PiniaPluginContext) {
	store._instance = pinia
}
