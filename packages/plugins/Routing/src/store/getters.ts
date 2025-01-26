import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { getInitialState } from './state'

const getters = {
  ...generateSimpleGetters(getInitialState()),
  renderType: (_, __, ___, rootGetters) => {
    return rootGetters.configuration?.routing?.renderType
      ? rootGetters.configuration.routing.renderType
      : 'independent'
  },
  selectedTravelMode({ selectedTravelMode }, { selectableTravelModes }) {
    return selectedTravelMode || selectableTravelModes[0]
  },
  selectedPreference({ selectedPreference }, { selectablePreferences }) {
    return selectedPreference || selectablePreferences[0]
  },
}

export default getters
