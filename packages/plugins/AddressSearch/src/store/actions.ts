import debounce from 'lodash.debounce'
import { FeatureCollection } from 'geojson'
import { PolarActionTree } from '@polar/lib-custom-types'
import SearchResultSymbols from '../utils/searchResultSymbols'
import { getMethodContainer } from '../utils/searchMethods/getSearchMethod'
import {
  AddressSearchGetters,
  AddressSearchState,
  AddressSearchAutoselect,
} from '../types'

// OK for module action set creation
// eslint-disable-next-line max-lines-per-function
export const makeActions = () => {
  let abortController
  let debouncedLoad
  let methodContainer

  const actions: PolarActionTree<AddressSearchState, AddressSearchGetters> = {
    setupModule({ getters }): void {
      debouncedLoad = debounce(
        () => this.dispatch('plugin/addressSearch/load'),
        getters.waitMs
      ).bind(this)

      // searchMethod without url is invalid – print error
      getters.searchMethods
        .filter(({ url }) => !url)
        .forEach((miss) =>
          console.error(
            `POLAR Plugin AddressSearch: A specification is missing an URL: (${JSON.stringify(
              miss
            )})`
          )
        )

      methodContainer = getMethodContainer()

      // add custom added search implementations, if any configured
      const customSearchMethods =
        getters.addressSearchConfiguration.customSearchMethods
      if (customSearchMethods) {
        methodContainer.registerSearchMethods(
          Object.fromEntries(
            Object.entries(customSearchMethods).map(([key, value]) => [
              key,
              value.bind(this),
            ])
          )
        )
      }
    },
    setSelectedGroupId(
      { commit, dispatch, state },
      selectedGroupId: string
    ): void {
      commit('setSelectedGroupId', selectedGroupId)

      /* whenever the selected search group name changes,
       * redo input – if it triggers a search, the user
       * will probably want to see the results in new
       * search service group */
      commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
      dispatch('input', state.inputValue)
    },
    input({ commit, dispatch }, input: string): void {
      commit('setInputValue', input)
      dispatch('abortAndRequest')
    },
    abortAndRequest() {
      if (abortController) {
        abortController.abort()
        abortController = undefined
      }
      debouncedLoad()
    },
    clear({ commit }): void {
      commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
      commit('setChosenAddress', null)
    },
    load({
      state: { inputValue },
      rootGetters,
      getters,
      commit,
      dispatch,
    }): Promise<void> | void {
      const { minLength } = getters.addressSearchConfiguration
      const activeSearchMethods = getters.selectedGroup
      // Value is null when the input is cleared; extra undefined check for safety
      if (
        typeof inputValue === 'undefined' ||
        inputValue === null ||
        inputValue.length < minLength
      ) {
        commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
        dispatch('indicateLoading', false)
        return
      }
      dispatch('indicateLoading', true)
      abortController = new AbortController()
      const localAbortControllerReference = abortController
      const searchPromises: Promise<FeatureCollection>[] =
        activeSearchMethods.map((method) =>
          methodContainer.getSearchMethod(method.type)(
            abortController.signal,
            method.url,
            inputValue,
            {
              ...method.queryParameters,
              epsg: rootGetters.configuration.epsg,
              map: rootGetters.map,
            }
          )
        )
      return Promise.allSettled(searchPromises)
        .then((results) => {
          const indexedFulfilledResults = results.reduce(
            (accumulator, result, index) => {
              if (result.status === 'fulfilled') {
                return [
                  ...accumulator,
                  {
                    value: result.value,
                    index,
                  },
                ]
              }
              return accumulator
            },
            [] as object[]
          )

          // only print errors if search was not aborted
          if (!localAbortControllerReference.signal.aborted) {
            ;(
              results.filter(
                ({ status }) => status === 'rejected'
              ) as PromiseRejectedResult[]
            ).forEach(({ reason }) =>
              console.error(
                'AddressSearch: An error occurred while sending a request: ',
                reason
              )
            )
          }

          commit('setSearchResults', indexedFulfilledResults)
        })
        .catch((error: Error) => {
          console.error(
            'AddressSearch: An error occurred while searching.',
            error
          )
          commit('setSearchResults', SearchResultSymbols.ERROR)
        })
        .finally(() => {
          dispatch('indicateLoading', false)
        })
    },
    indicateLoading(
      { getters: { addressSearchConfiguration }, commit },
      loading: boolean
    ): void {
      commit('setLoading', loading)
      const { addLoading, removeLoading } = addressSearchConfiguration
      if (loading && addLoading && addLoading.length > 0) {
        commit(addLoading, 'AddressSearch', { root: true })
      } else if (!loading && removeLoading && removeLoading.length > 0) {
        commit(removeLoading, 'AddressSearch', { root: true })
      }
    },
    selectResult(actionContext, payload): void {
      const { commit, getters } = actionContext
      const { feature, categoryId } = payload
      const customMethod =
        getters.addressSearchConfiguration.customSelectResult?.[categoryId]
      if (customMethod) {
        customMethod(actionContext, payload)
      } else {
        // default behaviour
        commit('setChosenAddress', feature)
        commit('setInputValue', feature.title)
        commit('setSearchResults', SearchResultSymbols.NO_SEARCH)
      }
    },

    /**
     * `search` is meant for programmatic access. User search is triggered from
     * the `input` action effects and features a debouncing mechanism.
     * @param vuexParameters - vuex standard parameter object
     * @param payload - input to search for and an autoselect mode
     */
    async search(
      { state, commit, dispatch, getters },
      {
        input,
        autoselect,
      }: { input: string; autoselect: AddressSearchAutoselect }
    ): Promise<void> {
      commit('setInputValue', input)
      if (abortController) {
        abortController.abort()
        abortController = undefined
      }
      await dispatch('load')

      if (typeof state.searchResults === 'symbol') {
        // error or word too short, nothing to do
        return
      }

      const firstFound = state.searchResults.find(
        ({ value }) => value.features.length
      )
      const firstFeatures = firstFound?.value?.features || []

      if (
        (autoselect === 'first' && firstFeatures.length >= 1) ||
        (autoselect === 'only' && firstFeatures.length === 1)
      ) {
        dispatch('selectResult', {
          feature: firstFeatures[0],
          categoryId:
            getters.selectedGroup[firstFound?.index || 0].categoryId || '',
        })
      }
    },
  }

  return actions
}
