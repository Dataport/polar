import { watch, type WatchOptions } from 'vue'
import { storeToRefs } from 'pinia'
import { useCoreStore } from '../stores/useCoreStore'

type SubscribeCallback = (value: unknown, oldValue: unknown) => void

export function subscribe(
	path: string,
	callback: SubscribeCallback,
	options: WatchOptions
) {
	const steps = path.split('/')
	const isCore = steps.length === 1

	// const store = isCore ? useCoreStore() : getStore(steps[0])
	const parameterName = steps[isCore ? 0 : 1]

	return watch(storeToRefs(useCoreStore())[parameterName], callback, {
		immediate: true,
		...options,
	})
}

// TODO(dopenguin): Implement this once plugins are added so that the respective store is selected here.
// function getStore(storeName: string) {}
