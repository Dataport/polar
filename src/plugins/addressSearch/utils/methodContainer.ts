import type { SearchMethodFunction } from '../types'

import bkg from '@/lib/getFeatures/bkg'
import mpapi from '@/lib/getFeatures/mpapi'
import nominatim from '@/lib/getFeatures/nominatim'
import { getWfsFeatures } from '@/lib/getFeatures/wfs'

export function getMethodContainer() {
	const methods = { bkg, mpapi, nominatim, wfs: getWfsFeatures }

	return {
		registerSearchMethods: (
			additionalMethods: Record<string, SearchMethodFunction>
		) => {
			Object.entries(additionalMethods).forEach(([type, searchMethod]) => {
				if (methods[type]) {
					console.error(
						`Method "${type}" already exists. Please choose a different name. Overrides are not allowed.`
					)
					return
				}
				methods[type] = searchMethod
			})
		},
		getSearchMethod: (type: string): SearchMethodFunction => {
			const method = methods[type]
			if (method) {
				return method
			}
			throw new Error(
				`The given type "${type}" does not define a valid searchMethod.`
			)
		},
	}
}

if (import.meta.vitest) {
	const { beforeEach, expect, test, vi } = import.meta.vitest

	const customMethod: SearchMethodFunction = () =>
		Promise.resolve({
			type: 'FeatureCollection',
			features: [],
		})
	const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

	beforeEach(() => {
		vi.clearAllMocks()
	})

	test('resolves the default search methods', () => {
		const container = getMethodContainer()

		expect(container.getSearchMethod('bkg')).toBe(bkg)
		expect(container.getSearchMethod('mpapi')).toBe(mpapi)
		expect(container.getSearchMethod('wfs')).toBe(getWfsFeatures)
	})

	test('registers and resolves an additional search method', () => {
		const container = getMethodContainer()

		container.registerSearchMethods({ custom: customMethod })

		expect(container.getSearchMethod('custom')).toBe(customMethod)
	})

	test('logs an error and does not override an existing method', () => {
		const container = getMethodContainer()

		container.registerSearchMethods({ bkg: customMethod })

		expect(errorSpy).toHaveBeenCalledTimes(1)
		expect(errorSpy).toHaveBeenCalledWith(
			// enrichedConsole prepends a source-location argument
			expect.any(String),
			'Method "bkg" already exists. Please choose a different name. Overrides are not allowed.'
		)
		expect(container.getSearchMethod('bkg')).toBe(bkg)
	})

	test('throws for an unknown search method type', () => {
		const container = getMethodContainer()

		expect(() => container.getSearchMethod('unknown')).toThrow(
			'The given type "unknown" does not define a valid searchMethod.'
		)
	})
}
