import type { StoreReference } from '@/core'
import { useCoreStore } from '@/core/stores/export'

/**
 * Get the store for a `StoreReference`.
 *
 * @param ref - Store reference
 * @returns Referenced store
 */
export function getRefStore(ref: StoreReference) {
	const coreStore = useCoreStore()
	return ref.plugin ? coreStore.getPluginStore(ref.plugin) : coreStore
}
