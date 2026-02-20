import bkg from '@/lib/getFeatures/bkg'
import mpapi from '@/lib/getFeatures/mpapi'
import { getWfsFeatures } from '@/lib/getFeatures/wfs'

import type { SearchMethodFunction } from '../types'

export function getMethodContainer() {
	const methods = { bkg, mpapi, wfs: getWfsFeatures }

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
