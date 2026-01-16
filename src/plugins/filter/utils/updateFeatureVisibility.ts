import { Feature } from 'ol'
import VectorSource from 'ol/source/Vector'

import { hideFeature, showFeature } from '@/lib/invisibleStyle'

import type { FilterState } from '../types'

import { doesFeaturePassFilter } from './doesFeaturePassFilter'

/**
 * Update the features in the given source according to the given filter.
 *
 * @param source - Source of the layer
 * @param filter - Filter state for the layer
 */
export function updateFeatureVisibility(
	source: VectorSource,
	filter: FilterState
) {
	const features = source
		.getFeatures()
		.flatMap((feature) => feature.get('features') || [feature]) as Feature[]

	// For performance reasons, do not update each feature individually on screen.
	source.clear()
	features.forEach((feature) => {
		;(doesFeaturePassFilter(feature, filter) ? showFeature : hideFeature)(
			feature
		)
	})
	source.addFeatures(features)
}

if (import.meta.vitest) {
	const { test, expect, vi } = import.meta.vitest
	const { isVisible, isInvisible } = await import('@/lib/invisibleStyle')
	const doesFeaturePassFilterFile = await import('./doesFeaturePassFilter')
	const filterSpy = vi.spyOn(doesFeaturePassFilterFile, 'doesFeaturePassFilter')
	filterSpy.mockImplementation((f: Feature) => f.get('filter') === 'yes')

	test('feature visibility is updated according to filter', () => {
		const alpha = new Feature()
		alpha.set('filter', 'yes')

		const beta = new Feature()
		beta.set('filter', 'no')

		const source = new VectorSource()
		source.addFeatures([alpha, beta])

		updateFeatureVisibility(source, {})

		expect(source.getFeatures()).toHaveLength(2)
		expect(source.getFeatures()).toContain(alpha)
		expect(isVisible(alpha)).toBeTruthy()
		expect(source.getFeatures()).toContain(beta)
		expect(isInvisible(beta)).toBeTruthy()
	})
}
