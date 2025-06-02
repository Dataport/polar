import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
  currentlyFocusedInput: -1,
  route: [[], []],
  selectedTravelMode: 'driving-car',
  displayPreferences: false,
  selectedPreference: 'recommended',
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
})
