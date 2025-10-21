import type { Ref } from 'vue'
import { useCoreStore } from '@/core/stores/export'
import { computedT } from '@/lib/computedT'

export function notifyUser(
	severity: 'error' | 'warning' | 'info' | 'success',
	text: string | Ref<string> | (() => string)
) {
	const coreStore = useCoreStore()
	const toastStore = coreStore.getPluginStore('toast')
	if (!toastStore) {
		return
	}
	if (typeof text === 'function') {
		text = computedT(text)
	}
	toastStore.addToast({ severity, text })
}
