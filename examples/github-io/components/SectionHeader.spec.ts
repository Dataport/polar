import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

import SectionHeader from './SectionHeader.vue'

describe('SectionHeader', () => {
	test('renders its content and alignment variant', () => {
		const wrapper = mount(SectionHeader, {
			props: {
				badge: 'Features',
				badgeColor: 'green',
				title: 'A title',
				description: 'A description',
				align: 'left',
			},
		})

		expect(wrapper.find('h3').text()).toBe('A title')
		expect(wrapper.find('p').text()).toBe('A description')
		expect(wrapper.find('.lp-section-header--left').exists()).toBe(true)
		expect(wrapper.find('.kern-badge--green').text()).toContain('Features')
	})
})
