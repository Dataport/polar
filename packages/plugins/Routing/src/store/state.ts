import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
  route: [],
  selectedTravelMode: '',
  selectableTravelModes: [
    { key: 'Car', localKey: 'common:plugins.routing.travelMode.car' },
    { key: 'hdv', localKey: 'common:plugins.routing.travelMode.hdv' },
    { key: 'bike', localKey: 'common:plugins.routing.travelMode.bike' },
    { key: 'walking', localKey: 'common:plugins.routing.travelMode.walking' },
    {
      key: 'wheelchair',
      localKey: 'common:plugins.routing.travelMode.wheelchair',
    },
  ],
  displayPreference: false,
  selectedPreference: '',
  selectablePreferences: ['recommended', 'fastest', 'shortest'],
  displayRouteTypesToAvoid: false,
  serviceID: '',
  numberOfKeysToTriggerSearch: 3,
  // SearchResults.NO_SEARCH
  searchResults: [],
})
