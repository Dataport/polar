import type { PiniaPluginContext } from 'pinia'

export function saveInstance({ pinia, store }: PiniaPluginContext) {
	store._instance = pinia
}
