import { computed } from 'vue'

import { useCoreStore } from '@/core/stores/export'

export function computedT(translator: () => string) {
	return computed(() => {
		const coreStore = useCoreStore()

		// This reactive value needs to recompute on language changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		coreStore.language

		return translator()
	})
}
