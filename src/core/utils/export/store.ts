import { watch, type WatchOptions } from 'vue'

import type { PolarContainer } from '@/core'
import type { useCoreStore } from '@/core/stores/export'
import type {
	BundledPluginId,
	BundledPluginStores,
	PluginId,
	PolarPluginStore,
} from '@/core/types'

export type SubscribeCallback = (value: unknown, oldValue: unknown) => void

type StoreType<T extends 'core' | BundledPluginId> = T extends BundledPluginId
	? ReturnType<BundledPluginStores<T>>
	: ReturnType<typeof useCoreStore>
type ExtractStateAndGetters<T extends { $state: unknown }> =
	| keyof T['$state']
	| {
			[K in keyof T]: T[K] extends (..._args) => unknown
				? never
				: K extends `$${string}` | `_${string}`
					? never
					: K
	  }[keyof T]
type StoreId = 'core' | PluginId
type StoreParameter<T extends StoreId> = T extends 'core' | BundledPluginId
	? ExtractStateAndGetters<StoreType<T>>
	: string

/**
 * Returns the store module for the core or for an active plugin.
 *
 * @param map - Map to get the corresponding store for.
 * @param storeName - Either `'core'` for the core store or the plugin ID for a plugin's store.
 * @returns Core store for the map if `'core'` is given, or the plugin's store else.
 */
export function getStore<T extends StoreId>(
	map: typeof PolarContainer,
	storeName: T
): T extends 'core' | BundledPluginId ? StoreType<T> : PolarPluginStore {
	return storeName === 'core' ? map.store : map.store.getPluginStore(storeName)
}

/**
 * Subscribe to a store value of the core store or any plugin's store.
 *
 * @param map - Map to subscribe the value at.
 * @param storeName - Either `'core'` for the core store or the plugin ID for a plugin's store.
 * @param parameterName - Name of the parameter to update.
 * @param callback - Function to call on updates.
 * @param options - Additional options to give to `watch`.
 */
export function subscribe<T extends StoreId>(
	map: typeof PolarContainer,
	storeName: T,
	parameterName: StoreParameter<T>,
	callback: SubscribeCallback,
	options?: WatchOptions
) {
	const store = getStore(map, storeName)
	// @ts-expect-error | Parameter name is checked, but TS does not infer this
	return watch(() => store[parameterName], callback, {
		immediate: true,
		...options,
	})
}

/**
 * Updates the parameter {@link parameterName | parameter} in the {@link storeName | store} with the {@link payload}.
 *
 * @param map - Map to update the value at.
 * @param storeName - Either `'core'` for the core store or the plugin ID for a plugin's store.
 * @param parameterName - Name of the parameter to update.
 * @param payload - The payload to update the given parameter with.
 */
export function updateState<T extends StoreId>(
	map: typeof PolarContainer,
	storeName: T,
	parameterName: StoreParameter<T>,
	payload: unknown
) {
	const store = getStore(map, storeName)
	// @ts-expect-error | Parameter name is checked, but TS does not infer this
	store[parameterName] = payload
}
