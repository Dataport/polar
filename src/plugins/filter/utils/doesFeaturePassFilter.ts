import type { FilterState } from '../types'

import { Feature } from 'ol'

import { parseDateWithPattern } from './parseDateWithPattern'

/**
 * Checks if a given feature passes the given filter state.
 *
 * @param feature - Feature to check
 * @param filter - Current filter state
 * @returns `true` if the feature should be visible, `false` otherwise
 */
export function doesFeaturePassFilter(feature: Feature, filter: FilterState) {
	const passesKnownValues = Object.entries(filter.knownValues).every(
		([key, values]) => values.includes(feature.get(key))
	)
	const passesTimeSpan =
		!filter.timeSpan ||
		Object.entries(filter.timeSpan).every(([key, config]) => {
			const featureDate = parseDateWithPattern(feature.get(key), config.pattern)
			return featureDate >= config.from && featureDate < config.until
		})
	return passesKnownValues && passesTimeSpan
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	const feature = new Feature()
	feature.set('category', 'blue')
	feature.set('time', '2025-01-01')

	const passingTimeSpan = {
		time: {
			pattern: 'YYYY-MM-DD',
			from: new Date('Jan 1, 2024'),
			until: new Date('Dec 31, 2026'),
		},
	} satisfies FilterState['timeSpan']

	const failingTimeSpan = {
		time: {
			pattern: 'YYYY-MM-DD',
			from: new Date('Jan 1, 2024'),
			until: new Date('Dec 31, 2024'),
		},
	} satisfies FilterState['timeSpan']

	test('a feature passes an empty filter', () => {
		const filter = { knownValues: {} } satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature passes the category filter', () => {
		const filter = {
			knownValues: {
				category: ['blue'],
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature fails the category filter', () => {
		const filter = {
			knownValues: {
				category: ['red'],
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})

	test('a feature passes the time filter', () => {
		const filter = {
			knownValues: {},
			timeSpan: passingTimeSpan,
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature fails the time filter', () => {
		const filter = {
			knownValues: {},
			timeSpan: failingTimeSpan,
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})

	test('a feature fails one out of two filters', () => {
		const filter = {
			knownValues: {
				category: ['blue'],
				misc: ['yes'],
			},
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})

	test('a feature passes combined category and time filters', () => {
		const filter = {
			knownValues: {
				category: ['blue'],
			},
			timeSpan: passingTimeSpan,
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeTruthy()
	})

	test('a feature fails combined filters when only the time filter fails', () => {
		const filter = {
			knownValues: {
				category: ['blue'],
			},
			timeSpan: failingTimeSpan,
		} satisfies FilterState
		expect(doesFeaturePassFilter(feature, filter)).toBeFalsy()
	})
}
