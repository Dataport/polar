import { expect, test as _test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { useToastStore } from '../store'
import ToastUI from './ToastUI.ce.vue'

/* eslint-disable no-empty-pattern */
const test = _test.extend<{
	wrapper: VueWrapper
	store: ReturnType<typeof useToastStore>
}>({
	wrapper: async ({}, use) => {
		const wrapper = mount(ToastUI, {
			global: {
				plugins: [createTestingPinia({ createSpy: vi.fn })],
				mocks: {
					$t: (key, { ns, context }) => `$t(${ns}:${key}_${context})`,
				},
			},
		})
		await use(wrapper)
	},
	store: async ({}, use) => {
		const store = useToastStore()
		await use(store)
	},
})
/* eslint-enable no-empty-pattern */

test('Component shows multiple toasts', async ({ wrapper, store }) => {
	// @ts-expect-error | toasts are readonly
	store.toasts = [
		{ text: 'ALPHA', severity: 'info' },
		{ text: 'BETA', severity: 'error' },
	]
	await nextTick()

	expect(
		wrapper.find('.kern-alert:nth-of-type(1) .kern-title').text()
	).toContain('ALPHA')
	expect(
		wrapper.find('.kern-alert:nth-of-type(2) .kern-title').text()
	).toContain('BETA')
})

test('Component removes toast on dismiss click', async ({ wrapper, store }) => {
	// @ts-expect-error | toasts are readonly
	store.toasts = [
		{ text: 'ALPHA', severity: 'info' },
		{ text: 'BETA', severity: 'error' },
	]
	await nextTick()

	await wrapper.find('.kern-alert:nth-of-type(2) button').trigger('click')
	expect(store.removeToast).toHaveBeenCalledExactlyOnceWith(store.toasts[1])
})
