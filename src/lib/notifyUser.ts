import i18next, { type TOptions } from 'i18next'
import { useCoreStore } from '@/core/stores/export'
import { type ToastOptions } from '@/plugins/toast'

export function notifyUser(
	severity: 'error' | 'warning' | 'info' | 'success',
	translationKey: string,
	translationContext?: TOptions,
	toastOptions?: ToastOptions
) {
	const coreStore = useCoreStore()
	const toastStore = coreStore.getPluginStore('toast')
	if (!toastStore) {
		return
	}
	const text = i18next.t(translationKey, translationContext)
	toastStore.addToast({ severity, text }, toastOptions)
}
