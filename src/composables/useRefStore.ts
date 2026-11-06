import type { StoreReference } from '@/core'

import { useCoreStore } from '@/core/stores'

type CoreStore = ReturnType<typeof useCoreStore>

/**
 * Get the store for a `StoreReference`.
 *
 * @param ref - Store reference
 * @returns Referenced store
 */
export function useRefStore(
	ref: StoreReference
): CoreStore | ReturnType<CoreStore['getPluginStore']> {
	const coreStore = useCoreStore()
	return ref.plugin ? coreStore.getPluginStore(ref.plugin) : coreStore
}
