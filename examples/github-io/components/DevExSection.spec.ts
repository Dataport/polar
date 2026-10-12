import { mount } from '@vue/test-utils'
import { describe, expect, test, vi } from 'vitest'

import DevExSection from './DevExSection.vue'

describe('DevExSection', () => {
	test('switches code tabs and copies the active snippet', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		Object.assign(navigator, { clipboard: { writeText } })
		const wrapper = mount(DevExSection)
		const tabs = wrapper.findAll('[role="tab"]')

		expect(tabs).toHaveLength(3)
		expect(tabs[0].attributes('aria-selected')).toBe('true')

		await tabs[1].trigger('click')
		await wrapper.get('.copy-btn').trigger('click')

		expect(tabs[1].attributes('aria-selected')).toBe('true')
		expect(writeText).toHaveBeenCalledOnce()
		expect(wrapper.get('.copy-btn').text()).toContain('Copied')
	})
})
