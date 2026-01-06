/* eslint-disable tsdoc/syntax */
/**
 * @module \@polar/polar/plugins/addressSearch/store
 */
/* eslint-enable tsdoc/syntax */

import { debounce, toMerged } from 'es-toolkit'
import { t } from 'i18next'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
	type AddressSearchOptions,
	type GroupProperties,
	PluginId,
	type SearchResult,
	type SearchMethodConfiguration,
} from './types'
import { getMethodContainer } from './utils/methodContainer'
import { getResultsFromPromises } from './utils/getResultsFromPromises'
import SearchResultSymbols from './utils/searchResultSymbols'
import { useCoreStore } from '@/core/stores/export'
import type { PolarGeoJsonFeature } from '@/core'

const defaultGroupProperties: GroupProperties = {
	// TODO: The label should be translated for others as well -> The translation should probably not take place here but in the GroupSelect dropdown
	label: t(($) => $.defaultLabel, { ns: PluginId }),
	hint: '',
	resultDisplayMode: 'mixed',
	limitResults: Number.MAX_SAFE_INTEGER,
}

/** Same pattern for hint/label retrieval. */
const retrieve = (
	searchMethodsByGroupId: Record<string, SearchMethodConfiguration[]>,
	selectedGroupProperties: GroupProperties,
	selectedGroupId: string,
	key: string
): string =>
	selectedGroupProperties[key] ||
	// if not set, first entry defines [key] value
	searchMethodsByGroupId[selectedGroupId]?.[0]?.[key] ||
	defaultGroupProperties[key]

/* eslint-disable tsdoc/syntax */
/**
 * @function
 *
 * Plugin store for the address search.
 */
/* eslint-enable tsdoc/syntax */
export const useAddressSearchStore = defineStore(
	'plugins/addressSearch',
	() => {
		const coreStore = useCoreStore()

		let abortController: AbortController | null = null
		let debouncedSearch: ReturnType<typeof debounce<typeof _search>>
		let methodContainer: ReturnType<typeof getMethodContainer>

		const chosenAddress = ref<PolarGeoJsonFeature | null>(null)
		const _inputValue = ref('')
		const isLoading = ref(false)
		const searchResults = ref<SearchResult[] | symbol>(
			SearchResultSymbols.NO_SEARCH
		)
		const selectedGroupId = ref('defaultGroup')

		const afterResultComponent = computed(
			() => configuration.value.afterResultComponent || null
		)
		const configuration = computed(
			() => coreStore.configuration.addressSearch as AddressSearchOptions
		)
		const inputValue = computed({
			get: () => _inputValue.value,
			set: (value) => {
				if (value === _inputValue.value) {
					return
				}
				_inputValue.value = value
				abortAndRequest()
			},
		})
		const featuresAvailable = computed(
			() =>
				Array.isArray(searchResults.value) &&
				searchResults.value.length > 0 &&
				searchResults.value.some(
					({ features: { features } }) =>
						Array.isArray(features) && features.length > 0
				)
		)
		const getGroupProperties = computed(
			() =>
				(groupId: string): GroupProperties => {
					const selectedGroupProperties =
						configuration.value.groupProperties?.[groupId] ||
						({} as GroupProperties)
					// defaultGroup is only one with predefined values
					return groupId === 'defaultGroup'
						? toMerged(defaultGroupProperties, selectedGroupProperties)
						: selectedGroupProperties
				}
		)
		const groupIds = computed(() => Object.keys(searchMethodsByGroupId.value))
		const groupSelectOptions = computed(() =>
			Object.keys(searchMethodsByGroupId).map((key) => ({
				value: key,
				text: retrieve(
					searchMethodsByGroupId.value,
					selectedGroupProperties.value,
					key,
					'label'
				),
			}))
		)
		const hasMultipleGroups = computed(() => groupIds.value.length > 1)
		const hint = computed(() => {
			if (isLoading.value) {
				return t(($) => $.hint.loading, { ns: PluginId })
			}

			if (searchResults.value === SearchResultSymbols.ERROR) {
				return t(($) => $.hint.error, { ns: PluginId })
			}

			if (
				inputValue.value.length > 0 &&
				inputValue.value.length < minLength.value
			) {
				return t(($) => $.hint.tooShort, {
					ns: PluginId,
					minLength: minLength.value,
				})
			}

			if (
				searchResults.value !== SearchResultSymbols.NO_SEARCH &&
				!featuresAvailable.value
			) {
				return t(($) => $.hint.noResults, { ns: PluginId })
			}

			return selectedGroupHint.value
		})
		const limitResults = computed(
			() =>
				selectedGroupProperties.value.limitResults ||
				defaultGroupProperties.limitResults
		)
		const minLength = computed(() =>
			typeof configuration.value.minLength === 'number'
				? configuration.value.minLength
				: 0
		)
		const searchMethodsByGroupId = computed<
			Record<string, SearchMethodConfiguration[]>
		>(() =>
			configuration.value.searchMethods.reduce((groups, searchMethod) => {
				const searchMethodName = searchMethod.groupId || 'defaultGroup'
				if (groups[searchMethodName]) {
					groups[searchMethodName].push(searchMethod)
				} else {
					groups[searchMethodName] = [searchMethod]
				}
				return groups
			}, {})
		)
		const selectedGroupHint = computed(() =>
			retrieve(
				searchMethodsByGroupId.value,
				selectedGroupProperties.value,
				selectedGroupId.value,
				'hint'
			)
		)
		const selectedGroupProperties = computed<GroupProperties>(() =>
			getGroupProperties.value(selectedGroupId.value)
		)
		const waitMs = computed(() =>
			typeof configuration.value.waitMs === 'number'
				? configuration.value.waitMs
				: 0
		)

		function setupPlugin() {
			debouncedSearch = debounce(_search, waitMs.value)
			methodContainer = getMethodContainer()
			selectedGroupId.value = groupIds.value[0] as string
			// TODO: Register customSearchMethods as callable ones to the methodContainer
		}

		function teardownPlugin() {}

		function abortAndRequest() {
			if (abortController) {
				abortController.abort()
				abortController = null
			}
			debouncedSearch()
		}

		function clear() {
			inputValue.value = ''
			searchResults.value = SearchResultSymbols.NO_SEARCH
			chosenAddress.value = null
		}

		function _search() {
			if (inputValue.value.length < minLength.value) {
				searchResults.value = SearchResultSymbols.NO_SEARCH
				isLoading.value = false
				return Promise.resolve()
			}
			isLoading.value = true
			abortController = new AbortController()
			const localAbortControllerReference = abortController
			return Promise.allSettled(
				configuration.value.searchMethods.map(
					async ({ categoryId, groupId, queryParameters, type, url }) => {
						const features = await methodContainer.getSearchMethod(type)(
							localAbortControllerReference.signal,
							url,
							inputValue.value,
							toMerged(queryParameters || {}, {
								epsg: coreStore.configuration.epsg,
							})
						)
						const id = categoryId || 'default'
						const properties = configuration.value.categoryProperties?.[id]
						return {
							categoryId: id,
							categoryLabel: properties
								? // @ts-expect-error | Other values can be used.
									t(properties.label)
								: t(($) => $.defaultLabel, { ns: PluginId }),
							features,
							groupId: groupId || 'defaultGroup',
						}
					}
				)
			)
				.then(
					(results) =>
						(searchResults.value = getResultsFromPromises(
							results,
							localAbortControllerReference
						))
				)
				.catch((error: unknown) => {
					console.error('An error occurred while searching.', error)
					searchResults.value = SearchResultSymbols.ERROR
				})
				.finally(() => {
					isLoading.value = false
				})
		}

		// TODO: External method
		function search() {}

		function selectResult(feature: PolarGeoJsonFeature, categoryId: string) {
			const customMethod = configuration.value.customSelectResult?.[categoryId]
			if (customMethod) {
				customMethod(feature, categoryId)
			} else {
				chosenAddress.value = feature
				_inputValue.value = feature.title
				searchResults.value = SearchResultSymbols.NO_SEARCH
			}
		}

		return {
			chosenAddress,
			inputValue,

			/** @internal */
			afterResultComponent,

			/** @internal */
			isLoading,

			searchResults,

			selectedGroupId,

			/**
			 * `true` if any service yielded features.
			 *
			 * @internal
			 */
			featuresAvailable,

			/** @internal */
			hint,

			/** @alpha */
			abortAndRequest,

			/** @alpha */
			clear,

			/**
			 * TODO
			 */
			search,

			/** @alpha */
			selectResult,

			/** @internal */
			setupPlugin,

			/** @internal */
			teardownPlugin,
		}
	}
)
