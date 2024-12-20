import { SelectResultFunction } from '@polar/lib-custom-types'
import {
  SearchResultSymbols,
  AddressSearchGetters,
  AddressSearchState,
} from '@polar/plugin-address-search'
import levenshtein from 'js-levenshtein'
import { dishAutocompleteUrl, isDevMode } from '../serviceUrlconstants'
import { DishAutocompleteFunction } from '../types'
import { MODE } from '../enums'

let lookup: string[] = []

const autocompleteFilter = (inputValue: string) => (lookuppable: string) =>
  // offer phrases that contain input
  lookuppable.toLowerCase().includes(inputValue.toLowerCase()) &&
  // don't offer entered phrase
  lookuppable.toLowerCase() !== inputValue.toLowerCase()

const autocompleteSorter = (inputValue: string) => (a: string, b: string) => {
  // arbitrarily prefer startsWith
  const aStartsWith = a.startsWith(inputValue)
  const bStartsWith = b.startsWith(inputValue)

  if (aStartsWith && !bStartsWith) {
    return -1
  }
  if (!aStartsWith && bStartsWith) {
    return 1
  }

  /* arbitrarily prefer closer string, might be more useful
   * than the alphabetical order */
  const diffA = levenshtein(a, inputValue)
  const diffB = levenshtein(b, inputValue)
  return diffA - diffB
}
// prevent error in intern mode because url is not replaced there
if (!isDevMode && MODE.EXTERN) {
  fetch(dishAutocompleteUrl)
    .then((response) => response.json())
    .then((json) => (lookup = json))
    .catch((e) =>
      console.error(
        '@polar/client-dish: Autocomplete initialization failed.',
        e
      )
    )
}

/**
 * To be usable within the AddressSearch plugin, autocomplete
 * implements the search function interface. From the outside,
 * it might as well by asynchronous.
 */
export const autocomplete: DishAutocompleteFunction = (_, __, inputValue) => {
  if (lookup.length === 0) {
    // initialization failed or still running; do nothing for now,
    // autocomplete is a secondary feature
    return Promise.resolve({
      type: 'FeatureCollection',
      features: [],
    })
  }

  const lookedUp = lookup
    .filter(autocompleteFilter(inputValue))
    .sort(autocompleteSorter(inputValue))

  /* NOTE
   * Resolves fake feature to satisfy plugin/AddressSearch API.
   * Avoiding actual zoom to [0, 0] is done by overriding the
   * selectResult mechanism.
   */
  return Promise.resolve({
    type: 'FeatureCollection',
    features: lookedUp.map((theLookedAt) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [0, 0],
      },
      properties: null,
      epsg: null,
      title: theLookedAt,
    })),
  })
}

/**
 * selecting autocomplete offer re-triggers search
 */
export const selectResult: SelectResultFunction<
  AddressSearchState,
  AddressSearchGetters
> = ({ commit, dispatch }, { feature }) => {
  commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
  commit('setChosenAddress', null)
  dispatch('input', feature.title)
}
