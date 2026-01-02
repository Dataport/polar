import { Feature } from 'ol'
import type { FilterState } from '../types'
import { parseDateWithPattern } from './parseDateWithPattern'

/**
 * Checks if a given feature passes the given filter state.
 *
 * @param feature - Feature to check
 * @param filter - Current filter state
 * @returns `true` if the feature should be visible, `false` otherwise
 */
export function doesFeaturePassFilter(feature: Feature, filter: FilterState) {
	if (
		filter.knownValues &&
		!Object.entries(filter.knownValues).every(
			([key, values]) => values[feature.get(key)]
		)
	) {
		return false
	}

	if (
		filter.timeSpan &&
		!Object.entries(filter.timeSpan).every(([key, config]) => {
			const featureDate = parseDateWithPattern(feature.get(key), config.pattern)
			return featureDate >= config.from && featureDate < config.until
		})
	) {
		return false
	}

	return true
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	const feature = new Feature()
	feature.set('category', 'blue')
	feature.set('time', '2025-01-01')

	test('a feature passes an empty filter', () => {
		const filter = {} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature passes the category filter', () => {
		const filter = {
			knownValues: {
				category: {
					blue: true,
				},
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature fails the category filter', () => {
		const filter = {
			knownValues: {
				category: {
					red: true,
				},
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})

	test('a feature passes the time filter', () => {
		const filter = {
			timeSpan: {
				time: {
					pattern: 'YYYY-MM-DD',
					from: new Date('Jan 1, 2024'),
					until: new Date('Dec 31, 2026'),
				},
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature fails the time filter', () => {
		const filter = {
			timeSpan: {
				time: {
					pattern: 'YYYY-MM-DD',
					from: new Date('Jan 1, 2024'),
					until: new Date('Dec 31, 2024'),
				},
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})

	test('a feature fails one out of two filters', () => {
		const filter = {
			knownValues: {
				category: {
					blue: true,
				},
				misc: {
					yes: true,
				},
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})
}
