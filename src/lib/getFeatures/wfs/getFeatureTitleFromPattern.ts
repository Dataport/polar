import type { PolarGeoJsonFeature } from '@/core'

import { getBlocks } from './match'

interface Option {
	fillPercentage: number
	index: number
	keys: string[]
	pattern: string
}

function sortOptions(optionA: Option, optionB: Option) {
	// Prefer best fit
	if (optionA.fillPercentage > optionB.fillPercentage) {
		return -1
	}
	if (optionA.fillPercentage < optionB.fillPercentage) {
		return 1
	}
	// Prefer longest fit of best fits
	if (optionA.keys.length > optionB.keys.length) {
		return -1
	}
	if (optionA.keys.length < optionB.keys.length) {
		return 1
	}
	// Masterworks all, you can't go wrong
	if (optionA.index > optionB.index) {
		return -1
	}
	if (optionA.index < optionB.index) {
		return 1
	}
	// This never happens, until it does
	return 0
}

/**
 * Identifies the best-matching search pattern and fills it with found values.
 */
export function getFeatureTitleFromPattern(
	feature: PolarGeoJsonFeature,
	patterns: string[]
): string {
	const properties = feature.properties || {}
	const comparableOptions: Option[] = patterns.map((pattern, index) => {
		const blocks = getBlocks(pattern)
		const keys = blocks.reduce<string[]>(
			(keyAccumulator, block) =>
				Array.isArray(block)
					? [...keyAccumulator, block[1] as string]
					: keyAccumulator,
			[]
		)
		const foundKeys = keys.reduce(
			(sum, key) =>
				typeof properties[key] !== 'undefined' && properties[key] !== ''
					? sum + 1
					: sum,
			0
		)
		return {
			pattern,
			keys,
			index,
			fillPercentage: foundKeys / keys.length,
		}
	})

	const sortedOptions = [...comparableOptions].sort(sortOptions)
	const bestOption = sortedOptions[0] as Option

	return bestOption.keys.reduce(
		(fillPattern, key) =>
			fillPattern.replace(`{{${key}}}`, properties[key] || ''),
		bestOption.pattern
	)
}
