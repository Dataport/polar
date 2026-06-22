import { type PolarActionTree } from '@polar/lib-custom-types'
import { RoutingState, RoutingGetters } from '../types'

const actions: PolarActionTree<RoutingState, RoutingGetters> = {
	setCurrentlyFocusedInput({ commit, getters, rootGetters }, index: number) {
		const previousIndex = getters.currentlyFocusedInput
		commit('setCurrentlyFocusedInput', index)
		if (previousIndex === -1 && index !== -1) {
			rootGetters.map.addInteraction(draw)
		} else if (previousIndex !== -1 && index === -1) {
			rootGetters.map.removeInteraction(draw)
		}
	},
	// TODO: Add implementation for the search functionality
	/* async search({ commit, dispatch, getters, rootGetters }, input: string) {
    if (getters.searchConfiguration) {
      searchConfiguration: {
        availability: 'plugin/addressSearch/featuresAvailable',
        method: 'plugin/addressSearch/search',
        results: 'plugin/addressSearch/searchResults',
      },
      const { availability, method, results } = getters.searchConfiguration
      // TODO: Show some form of loader
      // TODO: Results are currently shown in @polar/plugin-address-search and not in the related input in this plugin
      await dispatch(method, { input }, { root: true })
      if (availability) {
        commit('setSearchResults', rootGetters[results])
      } else {
        // TODO: Show some info that the search failed? set searchResults to null or sth?
      }
    }
  }, */
}

export default actions
