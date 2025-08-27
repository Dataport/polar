/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/toast/store
 */
/* eslint-enable tsdoc/syntax */

import { defineStore } from 'pinia'
import { computed, ref, toRaw, type Reactive } from 'vue'
import { toMerged } from 'es-toolkit'
import {
	PluginId,
	type Toast,
	type ToastPluginOptions,
	type ToastSeverity,
	type ToastTheme,
} from './types'
import { useCoreStore } from '@/core/stores/export'

interface ToastItem {
	toast: Toast
	timeout?: ReturnType<typeof setTimeout>
}

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for showing messages to the user.
 */
/* eslint-enable tsdoc/syntax */
export const useToastStore = defineStore('plugins/toast', () => {
	const coreStore = useCoreStore()

	const configuration = computed(
		() => coreStore.configuration[PluginId] as ToastPluginOptions
	)

	const toasts = ref<ToastItem[]>([])

	function addToast(
		toast: Toast,
		options?: {
			timeout?: number | null
		}
	) {
		const optionsWithDefaults = toMerged(
			{
				timeout: toast.severity === 'error' ? null : 5000,
			},
			options || {}
		)
		toast.theme = toMerged(
			configuration.value[toast.severity] || {},
			toast.theme || {}
		)

		const toastItem: ToastItem = { toast }
		toasts.value.push(toastItem)

		if (typeof optionsWithDefaults.timeout === 'number') {
			toastItem.timeout = setTimeout(
				() => removeToast(toast),
				optionsWithDefaults.timeout
			)
		}
	}

	function removeToast(toast: Toast): boolean {
		const index = toasts.value.findIndex(
			(item) => toRaw(item.toast) === toRaw(toast)
		)
		if (index < 0) {
			return false
		}
		const [toastItem] = toasts.value.splice(index, 1)
		if (toastItem?.timeout) {
			clearTimeout(toastItem.timeout)
		}
		return true
	}

	return {
		/**
		 * List of all toasts that are visible.
		 *
		 * @alpha
		 */
		toasts: computed(() => toasts.value.map(({ toast }) => toast)),

		/**
		 * Shows a toast.
		 *
		 * If no timeout is given, the toast disappears after five seconds.
		 * Error toasts have no timeout by default.
		 * To disable the timeout, pass `null` explicitly.
		 */
		addToast,

		/**
		 * Removes a toast.
		 *
		 * The exact object reference to the toast object passed to `addToast` is needed.
		 * A deep equal object will not work.
		 *
		 * If the toast was already removed, this method does nothing.
		 * If the toast has a connected timeout, it is canceled.
		 *
		 * @returns `true` if the toast could be found and removed, `false` otherwise
		 */
		removeToast,
	}
})

if (import.meta.vitest) {
	const { expect, test: _test, vi } = import.meta.vitest
	const { createPinia, setActivePinia } = await import('pinia')
	const { reactive } = await import('vue')

	const mockedUseCoreStore = vi.hoisted(() => vi.fn())
	vi.mock('@/core/stores/export', () => ({
		useCoreStore: mockedUseCoreStore,
	}))

	/* eslint-disable no-empty-pattern */
	const test = _test.extend<{
		coreStore: Reactive<Record<string, unknown>>
		store: ReturnType<typeof useToastStore>
		timer: null
	}>({
		coreStore: [
			async ({}, use) => {
				const coreStore = reactive({
					configuration: { [PluginId]: {} },
				})
				mockedUseCoreStore.mockReturnValue(coreStore)
				await use(coreStore)
			},
			{ auto: true },
		],
		store: async ({}, use) => {
			setActivePinia(createPinia())
			const store = useToastStore()
			await use(store)
		},
		timer: [
			async ({}, use) => {
				vi.useFakeTimers()
				await use(null)
				vi.resetAllMocks()
			},
			{ auto: true },
		],
	})
	/* eslint-enable no-empty-pattern */

	test('Toast can be added and safely removed', ({ store }) => {
		const toast: Toast = {
			text: 'TOAST',
			severity: 'error',
		}
		store.addToast(toast)
		expect(store.toasts.length).toBe(1)
		expect(toRaw(store.toasts[0])).toEqual(toast)

		expect(store.removeToast(toast)).toBe(true)
		expect(store.toasts.length).toBe(0)
		expect(store.removeToast(toast)).toBe(false)
	})

	test.for([
		{ severity: 'error', timeout: null },
		{ severity: 'warning', timeout: 5 },
		{ severity: 'info', timeout: 5 },
		{ severity: 'success', timeout: 5 },
	])(
		'Toast with severity $severity is automatically removed after $timeout seconds (null = never)',
		({ severity, timeout }, { store }) => {
			store.addToast({
				text: 'TOAST',
				severity: severity as ToastSeverity,
			})
			if (timeout) {
				vi.advanceTimersByTime(timeout * 1000 - 1)
				expect(store.toasts.length).toBe(1)
				vi.advanceTimersByTime(1)
				expect(store.toasts.length).toBe(0)
			} else {
				vi.runAllTimers()
				expect(store.toasts.length).toBe(1)
			}
		}
	)

	test.for([
		{
			config: { color: 'SC', icon: 'SI' },
			options: { icon: 'OI' },
			result: { color: 'SC', icon: 'OI' },
		},
		{
			config: { icon: 'SI' },
			options: {},
			result: { icon: 'SI' },
		},
	])(
		'Toast consideres theme settings in the right precedence',
		({ config, options, result }, { coreStore, store }) => {
			// @ts-expect-error | This is a test
			coreStore.configuration[PluginId].info = config
			store.addToast({
				text: 'TEXT',
				severity: 'info',
				theme: options as ToastTheme,
			})
			expect(store.toasts.length).toBe(1)
			expect(store.toasts[0]?.theme).toEqual(result)
		}
	)
}
