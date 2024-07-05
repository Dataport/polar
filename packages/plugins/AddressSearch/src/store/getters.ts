import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import {
  AddressSearchConfiguration,
  AddressSearchGroupProperties,
  PolarGetterTree,
  SearchMethodConfiguration,
} from '@polar/lib-custom-types'
import SearchResults from '../utils/searchResultSymbols'
import {
  AddressSearchGetters,
  AddressSearchState,
  FeatureListWithCategory,
} from '../types'
import { getInitialState } from './state'

const defaultGroupProperties: AddressSearchGroupProperties = {
  label: 'common:plugins.addressSearch.defaultGroup',
  placeholder: '',
  hint: '',
  resultDisplayMode: 'mixed',
  limitResults: Number.MAX_SAFE_INTEGER,
}

const defaultConfiguration: Partial<AddressSearchConfiguration> = {
  minLength: 0,
  waitMs: 0,
  searchMethods: [] as SearchMethodConfiguration[],
}

/** same pattern for label/hint/placeholder retrieval */
const retrieve = ({
  searchMethodsByGroupId,
  selectedGroupProperties,
  selectedGroupId,
  key,
}): string => {
  return (
    selectedGroupProperties[key] ||
    // if not set, first entry defines [key] value
    searchMethodsByGroupId[selectedGroupId][0][key] ||
    defaultGroupProperties[key]
  )
}

const getters: PolarGetterTree<AddressSearchState, AddressSearchGetters> = {
  ...generateSimpleGetters(getInitialState()),
  /** true if any service of selected group yielded features */
  featuresAvailable(_, { searchResults }) {
    return (
      Array.isArray(searchResults) &&
      searchResults.length > 0 &&
      searchResults.some(
        ({ value }) =>
          Array.isArray(value?.features) && value.features?.length > 0
      )
    )
  },
  addressSearchConfiguration(_, __, ___, rootGetters) {
    return {
      ...defaultConfiguration,
      ...(rootGetters.configuration?.addressSearch || {}),
    }
  },
  afterResultComponent(_, { addressSearchConfiguration }) {
    return addressSearchConfiguration.afterResultComponent || null
  },
  minLength(_, { addressSearchConfiguration }) {
    return addressSearchConfiguration.minLength
  },
  waitMs(_, { addressSearchConfiguration }) {
    return addressSearchConfiguration.waitMs
  },
  searchMethods(_, { addressSearchConfiguration }) {
    return addressSearchConfiguration.searchMethods
  },
  searchMethodsByGroupId(_, { searchMethods }) {
    const searchMethodGroups = {}
    searchMethods.forEach((searchMethod) => {
      const searchMethodName = searchMethod.groupId || 'defaultGroup'
      if (searchMethodGroups[searchMethodName]) {
        searchMethodGroups[searchMethodName].push(searchMethod)
      } else {
        searchMethodGroups[searchMethodName] = [searchMethod]
      }
    })
    return searchMethodGroups
  },
  groupIds(_, { searchMethodsByGroupId }) {
    return Object.keys(searchMethodsByGroupId)
  },
  selectedGroupId({ selectedGroupId }, { groupIds }) {
    return selectedGroupId || groupIds[0]
  },
  selectedGroup(_, { searchMethodsByGroupId, selectedGroupId }) {
    return searchMethodsByGroupId[selectedGroupId]
  },
  getGroupProperties(_, { addressSearchConfiguration }) {
    return (groupId) => {
      const selectedGroupProperties =
        addressSearchConfiguration.groupProperties?.[groupId] || {}

      if (groupId === 'defaultGroup') {
        // defaultGroup is only one with predefined values
        return {
          ...defaultGroupProperties,
          ...selectedGroupProperties,
        }
      }
      return selectedGroupProperties
    }
  },
  selectedGroupProperties(_, { selectedGroupId, getGroupProperties }) {
    return getGroupProperties(selectedGroupId)
  },
  limitResults(_, { selectedGroupProperties }) {
    return (
      selectedGroupProperties.limitResults ||
      defaultGroupProperties.limitResults
    )
  },
  categoryProperties(_, { addressSearchConfiguration }) {
    return addressSearchConfiguration.categoryProperties || {}
  },
  label(
    _,
    { searchMethodsByGroupId, selectedGroupProperties, selectedGroupId }
  ) {
    return retrieve({
      searchMethodsByGroupId,
      selectedGroupProperties,
      selectedGroupId,
      key: 'label',
    })
  },
  placeholder(
    _,
    { searchMethodsByGroupId, selectedGroupProperties, selectedGroupId }
  ) {
    return retrieve({
      searchMethodsByGroupId,
      selectedGroupProperties,
      selectedGroupId,
      key: 'placeholder',
    })
  },
  selectedGroupHint(
    _,
    { searchMethodsByGroupId, selectedGroupId, selectedGroupProperties }
  ) {
    return retrieve({
      searchMethodsByGroupId,
      selectedGroupProperties,
      selectedGroupId,
      key: 'hint',
    })
  },
  hint(
    { inputValue, searchResults },
    { selectedGroupHint, minLength, featuresAvailable, loading }
  ) {
    if (loading) {
      return 'common:plugins.addressSearch.hint.loading'
    }

    if (searchResults === SearchResults.ERROR) {
      return 'common:plugins.addressSearch.hint.error'
    }

    if (inputValue && inputValue.length > 0 && inputValue.length < minLength) {
      return 'common:plugins.addressSearch.hint.tooShort'
    }

    if (searchResults !== SearchResults.NO_SEARCH && !featuresAvailable) {
      return 'common:plugins.addressSearch.hint.noResults'
    }

    return selectedGroupHint
  },
  hasMultipleGroups(_, { groupIds }) {
    return groupIds.length > 1
  },
  groupSelectOptions(_, { searchMethodsByGroupId, getGroupProperties }) {
    return Object.keys(searchMethodsByGroupId).map((key) => ({
      value: key,
      text: retrieve({
        searchMethodsByGroupId,
        selectedGroupProperties: getGroupProperties(key),
        selectedGroupId: key,
        key: 'label',
      }),
    }))
  },
  featureListsWithCategory(
    { searchResults },
    { selectedGroup, categoryProperties }
  ) {
    if (typeof searchResults === 'symbol') {
      return [] as FeatureListWithCategory[]
    }
    return searchResults.map((entry) => ({
      features: entry.value.features,
      categoryId: selectedGroup[entry.index]?.categoryId || '',
      category:
        categoryProperties[selectedGroup[entry.index]?.categoryId || '']
          ?.label || '',
    }))
  },
  focusAfterSearch: (_, __, ___, rootGetters) =>
    rootGetters.configuration?.addressSearch?.focusAfterSearch || false,
}

export default getters
