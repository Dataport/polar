import type { Category } from '../types'

export function expandValue(value: Category['knownValues'][number]) {
	return typeof value === 'string' ? { key: value, values: [value] } : value
}

export function flattenValue(value: Category['knownValues'][number]) {
	return expandValue(value).key
}

export function getAllTechnicalValues(category: Category) {
	return category.knownValues.flatMap((v) => expandValue(v).values)
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	test('expandValue wraps a string into a key/values object', () => {
		expect(expandValue('shed')).toEqual({ key: 'shed', values: ['shed'] })
	})

	test('expandValue returns an object value unchanged', () => {
		const value = { key: 'home', values: ['home', 'castle'] }
		expect(expandValue(value)).toBe(value)
	})

	test('flattenValue returns the value itself for a string', () => {
		expect(flattenValue('shed')).toBe('shed')
	})

	test('flattenValue returns the key of an object value', () => {
		const value = { key: 'home', values: ['home', 'castle'] }
		expect(flattenValue(value)).toBe('home')
	})
}
