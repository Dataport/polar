import { FeatureCollection } from 'geojson'

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

export interface AddressSearchGetters extends AddressSearchState {
	focusAfterSearch: boolean
}

export type AddressSearchAutoselect = 'first' | 'only' | 'never'
