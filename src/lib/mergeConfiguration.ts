import { cloneDeep, mergeWith } from 'es-toolkit'

function replaceArrays(_, overrideValue: unknown) {
	return Array.isArray(overrideValue) ? overrideValue : undefined
}

/**
 * Deeply merges `override` onto a clone of `base`.
 * Arrays in `override` replace the matching arrays in `base` entirely
 * rather than being merged by index.
 *
 * @param base - Base configuration.
 * @param override - Values overriding `base`.
 * @returns A new merged configuration object.
 */
export function mergeConfiguration<T extends object, S extends object>(
	base: T,
	override: S
): T & S {
	return mergeWith(cloneDeep(base), override, replaceArrays)
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	test('replaces arrays entirely instead of merging them by index', () => {
		const base = { items: ['🐧', '🐶', '🦓'] }
		const override = { items: ['🐻‍❄️'] }

		expect(mergeConfiguration(base, override)).toEqual({ items: ['🐻‍❄️'] })
	})

	test('deep merges nested objects while override wins', () => {
		const base = { nested: { keep: '🐧', change: '🐶' } }
		const override = { nested: { change: '🐻‍❄️' } }

		expect(mergeConfiguration(base, override)).toEqual({
			nested: { keep: '🐧', change: '🐻‍❄️' },
		})
	})

	test('preserves functions by reference', () => {
		const fn = () => 'Thea has floppy ears 🐶'
		const merged = mergeConfiguration({ fn }, {})

		expect(merged.fn).toBe(fn)
	})

	test('does not mutate base', () => {
		const base = { items: ['🐧'], nested: { value: 42 } }
		mergeConfiguration(base, { items: ['🐻‍❄️'], nested: { value: 4 } })

		expect(base).toEqual({ items: ['🐧'], nested: { value: 42 } })
	})
}
