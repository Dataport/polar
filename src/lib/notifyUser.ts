import type { Ref } from 'vue'
import { useCoreStore } from '@/core/stores/export'

export function notifyUser(
	severity: 'error' | 'warning' | 'info' | 'success',
	text: string | Ref<string>
) {
	const coreStore = useCoreStore()
	const toastStore = coreStore.getPluginStore('toast')
	if (!toastStore) {
		return
	}
	toastStore.addToast({ severity, text })
}
