import type { SearchEngine, SearchEngineParams } from '../types'

import { toMerged } from 'es-toolkit'

import SearchResultSymbols from '@/lib/searchResultSymbols'

import { getResultsFromPromises } from './getResultsFromPromises'
import { getMethodContainer } from './methodContainer'

export function useAddressSearchEngine(
	params: SearchEngineParams
): SearchEngine {
	const methodContainer: ReturnType<typeof getMethodContainer> =
		getMethodContainer()
	if (params.customSearchMethods) {
		methodContainer.registerSearchMethods(params.customSearchMethods)
	}
	const searchEngine: SearchEngine = {
		runSearch: (inputValue: string, abortController: AbortController) => {
			if (inputValue.length < params.minLength) {
				return Promise.resolve(SearchResultSymbols.NO_SEARCH)
			}
			return Promise.allSettled(
				params.searchMethods.map(
					async ({
						categoryId,
						groupId,
						queryParameters,
						resultModifier,
						type,
						url,
					}) => {
						const features = await methodContainer.getSearchMethod(type)(
							abortController.signal,
							url,
							inputValue,
							toMerged(queryParameters || {}, {
								epsg: params.epsg,
							})
						)
						const id = categoryId || 'default'
						return {
							categoryId: id,
							categoryLabel: params.tCategoryLabel(id),
							features: resultModifier?.(features) ?? features,
							groupId: groupId || 'defaultGroup',
						}
					}
				)
			)
				.then((results) => {
					return getResultsFromPromises(results, abortController)
				})
				.catch((error: unknown) => {
					console.error('An error occurred while searching.', error)
					return Promise.resolve(SearchResultSymbols.ERROR)
				})
		},
	}
	return searchEngine
}
