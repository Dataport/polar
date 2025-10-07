import { computed } from 'vue'
import { useMainStore } from '../stores/main'

export function computedT(translator: () => string) {
	return computed(() => {
		const mainStore = useMainStore()

		// This reactive value needs to recompute on language changes.
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		mainStore.language

		return translator()
	})
}
