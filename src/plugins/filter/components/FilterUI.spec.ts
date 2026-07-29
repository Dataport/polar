import type { VueWrapper } from '@vue/test-utils'

import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { test as _test, assert, expect, vi } from 'vitest'
import { computed, nextTick } from 'vue'

import { useCoreStore } from '@/core/stores'
import { mockedT } from '@/test/utils/mockI18n'

import { useFilterStore } from '../store'
import FilterUI from './FilterUI.ce.vue'

/* eslint-disable no-empty-pattern */
const test = _test.extend<{
	wrapper: VueWrapper
	coreStore: ReturnType<typeof useCoreStore>
	store: ReturnType<typeof useFilterStore>
}>({
	wrapper: async ({}, use) => {
		vi.mock('i18next', () => ({
			t: (keyFn, opts) => mockedT(keyFn, opts),
		}))
		const wrapper = mount(FilterUI, {
			attachTo: document.body,
			global: {
				plugins: [createTestingPinia({ createSpy: vi.fn })],
				mocks: {
					$t: mockedT,
				},
			},
		})
		await use(wrapper)
		wrapper.unmount()
	},
	coreStore: async ({}, use) => {
		const store = useCoreStore()
		await use(store)
	},
	store: async ({}, use) => {
		const store = useFilterStore()
		await use(store)
	},
})
/* eslint-enable no-empty-pattern */

test('Component transfers category and time filters to the store', async ({
	wrapper,
	coreStore,
	store,
}) => {
	// @ts-expect-error | This is for testing
	coreStore.configuration = {
		filter: {
			layers: {
				one: {
					categories: [
						{
							targetProperty: 'pet',
							knownValues: ['cat', 'dog'],
							selectAll: true,
						},
					],
					time: {
						targetProperty: 'time',
						freeSelection: 'until',
						last: [1],
					},
				},
			},
		},
	}
	let selectionValue = ['cat', 'dog']
	const setSpy = vi.fn((value: string[]) => {
		selectionValue = value
	})
	// @ts-expect-error | This is for testing
	store.categories = computed(() => [
		{
			targetProperty: 'pet',
			knownValues: ['cat', 'dog'],
			selectAll: true,
			get selection() {
				return selectionValue
			},
			set selection(v: string[]) {
				setSpy(v)
			},
		},
	])

	await nextTick()

	const onlyCat = wrapper
		.findAll('label')
		.find(
			(lbl) => lbl.text() === '$t(filter:layer.one.category.pet.knownValue.cat)'
		)
	assert(onlyCat !== undefined, 'Could not find cat button')
	await onlyCat.trigger('click')

	expect(setSpy).toHaveBeenCalledExactlyOnceWith(['dog'])

	const yesterday = wrapper
		.findAll('label')
		.find((lbl) => lbl.text() === '$t(filter:time.last_1)')
	assert(yesterday !== undefined, 'Could not find yesterday button')
	await yesterday.trigger('click')

	expect(store.timeModel).toEqual('last-1')
})
