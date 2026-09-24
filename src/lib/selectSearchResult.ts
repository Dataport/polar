import type { PolarGeoJsonFeature } from '@/core'
import type { SelectResultFunction } from '@/plugins/addressSearch/types'

import SearchResultSymbols from '@/lib/searchResultSymbols'

export function selectSearchResult(
	feature: PolarGeoJsonFeature,
	customSelectResult: Record<string, SelectResultFunction> | undefined,
	categoryId = 'default'
) {
	const customMethod = customSelectResult?.[categoryId]
	if (customMethod) {
		customMethod(feature, categoryId)
	} else {
		return {
			feature,
			title: feature.title,
			resultSymbol: SearchResultSymbols.NO_SEARCH,
		}
	}
}
