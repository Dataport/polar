import { expect, test as _test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import FullscreenUI from './FullscreenUI.ce.vue'

/* eslint-disable no-empty-pattern */
const test = _test.extend<{
	wrapper: VueWrapper
	store: ReturnType<typeof useFullscreenStore>
}>({
	wrapper: async ({}, use) => {
		const wrapper = mount(FullscreenUI, {
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
		const store = useFullscreenStore()
		await use(store)
	},
})
/* eslint-enable no-empty-pattern */

test('Component listens to store changes', async ({ wrapper, store }) => {
	store.fullscreenEnabled = false
	await nextTick()
	expect(wrapper.find('.kern-label').text()).toContain(
		`$t(${PluginId}:button.label_on)`
	)

	store.fullscreenEnabled = true
	await nextTick()
	expect(wrapper.find('.kern-label').text()).toContain(
		`$t(${PluginId}:button.label_off)`
	)
})

test('Component triggers store changes', async ({ wrapper, store }) => {
	store.fullscreenEnabled = false
	await nextTick()

	await wrapper.find('button').trigger('click')
	expect(store.fullscreenEnabled).toBeTruthy()
	await nextTick()

	await wrapper.find('button').trigger('click')
	expect(store.fullscreenEnabled).toBeFalsy()
})
