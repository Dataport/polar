import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
  route: [],
  start: { coordinate: [0, 0], address: '' },
  end: { coordinate: [0, 0], address: '' },
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
  selectablePreferences: [{
      key: 'recommended',
      localKey: 'common:plugins.routing.preference.recommended',
    },
    {
      key: 'fastest',
      localKey: 'common:plugins.routing.preference.fastest',
    },
    {
      key: 'shortest',
      localKey: 'common:plugins.routing.preference.shortest',
    },
  ],
  displayRouteTypesToAvoid: false,
  selectableRouteTypesToAvoid: [{
      key: 'highways',
      localKey: 'common:plugins.routing.avoidRoutes.highways',
    },
    {
      key: 'tollways',
      localKey: 'common:plugins.routing.avoidRoutes.tollways',
    },
    {
      key: 'ferries',
      localKey: 'common:plugins.routing.avoidRoutes.ferries',
    },
  ],
  selectedRouteTypesToAvoid: [],
  serviceID: '',
  numberOfKeysToTriggerSearch: 3,
  // SearchResults.NO_SEARCH
  searchResults: [],
})
