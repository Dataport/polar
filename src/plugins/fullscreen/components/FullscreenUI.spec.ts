import { expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { useFullscreenStore } from '../store'
import { PluginId } from '../types'
import FullscreenUI from './FullscreenUI.ce.vue'

test('test button label', async () => {
	const wrapper = mount(FullscreenUI, {
		global: {
			plugins: [createTestingPinia({ createSpy: vi.fn })],
			mocks: {
				$t: (key, { ns, context }) => `$t(${ns}:${key}_${context})`,
			},
		},
	})

	const store = useFullscreenStore()
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
