import { RoutingState } from '../types'

const state = {
  currentlyFocusedInput: -1,
  route: [[], []],
  selectedTravelMode: '',
  displayPreferences: false,
  selectedPreference: '',
  displayRouteTypesToAvoid: false,
  selectedRouteTypesToAvoid: [],
  selectableRouteTypesToAvoid: [
    {
      key: 'highways',
      locale: 'plugins.routing.avoidRoutes.highways',
    },
    {
      key: 'tollways',
      locale: 'plugins.routing.avoidRoutes.tollways',
    },
    {
      key: 'ferries',
      locale: 'plugins.routing.avoidRoutes.ferries',
    },
  ],
  routingResponseData: {},
  searchResults: [],
}

export const getInitialState = (): RoutingState => state
