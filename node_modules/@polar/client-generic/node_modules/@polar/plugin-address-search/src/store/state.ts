import { AddressSearchState } from '../types'
import SearchResults from '../utils/searchResultSymbols'

export const getInitialState = (): AddressSearchState => ({
  chosenAddress: null,
  inputValue: '',
  loading: false,
  searchResults: SearchResults.NO_SEARCH,
  selectedGroupId: null,
})
