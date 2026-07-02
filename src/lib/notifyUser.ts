import type { Ref } from 'vue'
import type { ToastOptions } from '@/plugins/toast'

import { useCoreStore } from '@/core/stores'
import { computedT } from '@/lib/computedT'

export function notifyUser(
	severity: 'error' | 'warning' | 'info' | 'success',
	text: string | Ref<string> | (() => string),
	toastOptions?: ToastOptions
) {
	const coreStore = useCoreStore()
	const toastStore = coreStore.getPluginStore('toast')
	if (!toastStore) {
		return
	}
	if (typeof text === 'function') {
		text = computedT(text)
	}
	toastStore.addToast({ severity, text }, toastOptions)
}
