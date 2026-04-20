import type { Category } from '../types'

export function expandValue(value: Category['knownValues'][number]) {
	return typeof value === 'string' ? { key: value, values: [value] } : value
}

export function flattenValue(value: Category['knownValues'][number]) {
	return expandValue(value).key
}
