import type { Component } from 'vue'
import type {
	PluginOptions,
	PolarGeoJsonFeature,
	PolarGeoJsonFeatureCollection,
} from '@/core'
import type { QueryParameters } from '@/lib/getFeatures/types'

export const PluginId = 'addressSearch'

interface CategoryProperties {
	/**
	 * Category label to display next to results to identify the source.
	 * Can be a locale key.
	 *
	 * Only relevant if the search's {@link AddressSearchOptions.groupProperties | groupProperties} linked via
	 * {@link SearchMethodConfiguration.groupId | groupId} contain a {@link GroupProperties.resultDisplayMode | resultDisplayMode}
	 * scenario that uses categories.
	 */
	label: string
}

export interface GroupProperties {
	/**
	 * In `'mixed'`, results of all requested services are offered in a list in no specific order.
	 * In `'categorized'`, the results are listed by their searchService's categoryId.
	 *
	 * @defaultValue 'mixed'
	 */
	resultDisplayMode: 'mixed' | 'categorized'

	/**
	 * Hint that is displayed below the input field if no other plugin-state-based
	 * hint is to be displayed.
	 * Can be a locale key.
	 */
	hint?: string

	/** Display label for group selection. Can be a locale key. */
	label?: string

	/**
	 * If set, only the first `n` results (per category in `categorized`) are displayed initially.
	 * All further results can be opened via UI.
	 */
	limitResults?: number
}

export interface AddressSearchOptions extends PluginOptions {
	/**
	 * Array of search method descriptions.
	 * Only searches configured here can be used.
	 */
	searchMethods: SearchMethodConfiguration[]

	/**
	 * If given, this component will be rendered in the last line of every single
	 * search result. It will be forwarded its search result feature as prop
	 * `feature` of type `GeoJSON.Feature`, and the focus state of the result as
	 * prop `focus` of type `boolean`.
	 */
	afterResultComponent?: Component

	/**
	 * An object defining properties for a category.
	 * The searchMethod's {@link AddressSearchOptions.categoryId | addressSearch.categoryId} is used as identifier.
	 *
	 * A service without categoryId default to the {@link AddressSearchOptions.categoryId | addressSearch.categoryId} `"default"`.
	 */
	categoryProperties?: Record<string, CategoryProperties>

	/**
	 * An object with named search functions added to the existing set of
	 * configurable search methods.
	 */
	customSearchMethods?: Record<string, SearchMethodFunction>

	/**
	 * An object that maps categoryIds to functions.
	 * These functions are then called inplace of the default `selectResult`
	 * implementation. This allows overriding selection behaviour.
	 * Use `''` as the key for categoryless results.
	 */
	customSelectResult?: Record<string, SelectResultFunction>

	/**
	 * An object defining properties for a group.
	 * The searchMethod's groupId is used as identifier.
	 * All services without groupId fall back to the key `"defaultGroup"`.
	 */
	groupProperties?: Record<string, GroupProperties>

	/**
	 * Minimal input length before the search starts.
	 *
	 * @defaultValue 0
	 */
	minLength?: number

	/**
	 * Time passed in milliseconds before another search is started.
	 *
	 * @defaultValue 0
	 */
	waitMs?: number
}

/** Possible search methods by type. */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type SearchType = 'bkg' | 'wfs' | 'mpapi' | string

export type SearchDisplayMode = 'mixed' | 'categorized'

// TODO: Check if all parameters are actually being used

/** Object containing information for a specific search method. */
export interface SearchMethodConfiguration {
	/**
	 * Service type.
	 * Enum can be extended by configuration, see {@link AddressSearchOptions.customSearchMethods | addressSearch.customSearchMethods}.
	 */
	type: SearchType

	/**
	 * Search service URL.
	 * Should you require a service provider, please contact us for further information.
	 */
	url: string

	/**
	 * Grouped services can optionally be distinguished in the UI with categories.
	 * See {@link AddressSearchOptions.categoryProperties | addressSearch.categoryProperties} for configuration options.
	 *
	 * @defaultValue 'default'
	 */
	categoryId?: string

	/**
	 * All services with the same id are grouped and used together.
	 * See {@link AddressSearchOptions.groupProperties | addressSearch.groupProperties} for configuration options.
	 * If multiple groups exist, the UI offers a group switcher.
	 *
	 * @remarks
	 * Default groupId is `"defaultGroup"`.
	 */
	groupId?: string

	/**
	 * Hint that is displayed below the input field if no other plugin-state-based hint is to be displayed.
	 * Can be a locale key. If grouped with other services, the group's hint will be used instead.
	 */
	hint?: string

	/**
	 * Display label.
	 * Can be a locale key. If grouped with other services, the group's label will be used instead.
	 */
	label?: string

	/**
	 * Placeholder string to display on input element.
	 * Can be a locale key. If grouped with other services, the group's placeholder will be used instead.
	 */
	placeholder?: string

	/**
	 * The object further describes details for the search request.
	 * Its contents vary by service type, see {@link BKGParameters}, {@link MpapiParameters} or {@link WfsParameters}.
	 */
	queryParameters?: QueryParameters
}

export type SearchMethodFunction = (
	signal: AbortSignal,
	url: SearchMethodConfiguration['url'],
	inputValue: string,
	queryParameters: SearchMethodConfiguration['queryParameters']
) => Promise<PolarGeoJsonFeatureCollection> | never

export interface SearchResult {
	categoryId: string
	categoryLabel: string
	features: PolarGeoJsonFeatureCollection
	groupId: string
}

export type SelectResultFunction = (
	feature: PolarGeoJsonFeature,
	categoryId: string
) => void
