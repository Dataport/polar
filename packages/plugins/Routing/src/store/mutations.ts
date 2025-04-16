import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const mutations = {
  ...generateSimpleMutations(getInitialState()),

  /**
   * Updates 'selectableTravelModes' in the state by keeping only the travelModes
   * whose 'key' is included in 'selectedTravelModes'. The 'key' and 'localKey' properties are retained.
   *
   * @param state - The VueX state containing 'selectableTravelModes'.
   * @param selectedTravelModes - An array of 'key' values that should be retained.
   */
  setSelectableTravelModes(state, selectedTravelModes) {
    state.selectableTravelModes = state.selectableTravelModes
      .filter((travelMode) => selectedTravelModes.includes(travelMode.key))
      .map(({ key, localKey }) => ({ key, localKey }))
  },

  /**
   * Updates 'selectablePreferences' in the state by keeping only the preferences
   * whose 'key' is included in 'selectedPreferences'. The 'key' and 'localKey' properties are retained.
   *
   * @param state - The VueX state containing 'selectablePreferences'.
   * @param selectedPreferences - An array of 'key' values that should be retained.
   */
  setSelectablePreferences(state, selectedPreferences) {
    state.selectablePreferences = state.selectablePreferences
      .filter((preference) => selectedPreferences.includes(preference.key))
      .map(({ key, localKey }) => ({ key, localKey }))
  },
}

export default mutations
