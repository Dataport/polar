import {
	AddressSearchConfiguration,
	SearchMethodConfiguration,
	AddressSearchGroupProperties,
	AddressSearchCategoryProperties,
} from '@polar/lib-custom-types'
import { Feature, FeatureCollection } from 'geojson'

export interface FeatureIndexZip {
	value: FeatureCollection
	index: number
}

export interface AddressSearchState {
	/** Selected address by the user */
	chosenAddress: object | null
	/** Currently entered value */
	inputValue: string
	/** Whether to currently display a loading animation on the input */
	loading: boolean
	/**
	 * Found features with groupIndex in selected group or a symbol indicating that
	 * a) an error occurred
	 * b) nothing has been search yet
	 */
	searchResults: FeatureIndexZip[] | symbol
	/** SearchMethod group name; null will fall back to first-found */
	selectedGroupId: string | null
}

export interface FeatureListWithCategory {
	features: Feature[]
	categoryId: string
	category: string
}

export interface AddressSearchGetters extends AddressSearchState {
	addressSearchConfiguration: AddressSearchConfiguration
	featuresAvailable: boolean
	minLength: number
	waitMs: number
	searchMethods: SearchMethodConfiguration[]
	searchMethodsByGroupId: Record<string, SearchMethodConfiguration[]>
	groupIds: string[]
	selectedGroupId: string
	selectedGroup: SearchMethodConfiguration[]
	getGroupProperties: (string) => AddressSearchGroupProperties
	selectedGroupProperties: AddressSearchGroupProperties
	limitResults: number
	categoryProperties: AddressSearchCategoryProperties
	label: string
	placeholder: string
	selectedGroupHint: string
	hint: string
	hasMultipleGroups: boolean
	groupSelectOptions: string[]
	featureListsWithCategory: FeatureListWithCategory[]
	focusAfterSearch: boolean
}

export type AddressSearchAutoselect = 'first' | 'only' | 'never'
