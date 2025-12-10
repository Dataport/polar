import { createTestingPinia } from '@pinia/testing'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, test as _test, vi } from 'vitest'
import { useGeoLocationStore } from '../store'
import GeoLocation from './GeoLocation.ce.vue'
import { mockedT } from '@/test/utils/mockI18n'

/* eslint-disable no-empty-pattern */
const test = _test.extend<{
	wrapper: VueWrapper
	store: ReturnType<typeof useGeoLocationStore>
}>({
	wrapper: async ({}, use) => {
		const wrapper = mount(GeoLocation, {
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
		const store = useGeoLocationStore()
		await use(store)
	},
})
/* eslint-enable no-empty-pattern */

test('The button should include a tooltip', ({ wrapper }) => {
	const btn = wrapper.find('button')
	expect(btn.element.disabled).toBe(false)
	expect(btn.find('.polar-tooltip').exists()).toBe(true)
	expect(btn.find('.kern-label').exists()).toBe(true)
})

// TODO: Fix test
test.skip('The icon of the button should change on click to a filled icon if the user accepts the location request', async ({
	wrapper,
}) => {
	const btn = wrapper.find('button')
	expect(btn.element.disabled).toBe(false)
	expect(btn.find('.kern-icon').element.classList).toContain(
		'kern-icon--near-me'
	)

	await btn.trigger('click')

	expect(btn.element.disabled).toBe(false)
	expect(btn.find('.kern-icon').element.classList).toContain(
		'kern-icon--near-me-filled'
	)
})

test('The icon of the button should change on click to a disabled icon and be disabled if the user declines the location', async ({
	wrapper,
	store,
}) => {
	const btn = wrapper.find('button')

	expect(btn.element.disabled).toBe(false)
	expect(btn.find('.kern-icon').element.classList).toContain(
		'kern-icon--near-me'
	)

	store.isGeolocationDenied = true
	await btn.trigger('click')

	expect(btn.element.disabled).toBe(true)
	expect(btn.find('.kern-icon').element.classList).toContain(
		'kern-icon--near-me-disabled'
	)
})
