import { expect, test as _test, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import FullscreenUI from './FullscreenUI.ce.vue'
import { mockedT } from '@/test/utils/mockI18n'

/* eslint-disable no-empty-pattern */
const test = _test.extend<{
	wrapper: VueWrapper
	store: ReturnType<typeof useFullscreenStore>
}>({
	wrapper: async ({}, use) => {
		vi.mock('i18next', () => ({
			t: (key, { ns, context }) => `$t(${ns}:${key}_${context})`,
		}))
		const wrapper = mount(FullscreenUI, {
			global: {
				plugins: [createTestingPinia({ createSpy: vi.fn })],
				mocks: {
					$t: mockedT,
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

// TODO: These tests currently fail as the import of useCoreStore fails. Importing useMainStore yields no problems on the other hand
test.skip('Component listens to store changes', async ({ wrapper, store }) => {
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

test.skip('Component triggers store changes', async ({ wrapper, store }) => {
	store.fullscreenEnabled = false
	await nextTick()

	await wrapper.find('button').trigger('click')
	expect(store.fullscreenEnabled).toBeTruthy()
	await nextTick()

	await wrapper.find('button').trigger('click')
	expect(store.fullscreenEnabled).toBeFalsy()
})
