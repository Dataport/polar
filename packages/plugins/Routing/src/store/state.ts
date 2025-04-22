import { RoutingState } from '../types'
const state = {
  start: [],
  startAddress: '',
  end: [],
  endAddress: '',
  selectedTravelMode: '',
  displayPreferences: false,
  selectedPreference: '',
  displayRouteTypesToAvoid: false,
  selectedRouteTypesToAvoid: [],
  selectableRouteTypesToAvoid: [
    {
      key: 'highways',
      locale: 'common:plugins.routing.avoidRoutes.highways',
    },
    {
      key: 'tollways',
      locale: 'common:plugins.routing.avoidRoutes.tollways',
    },
    {
      key: 'ferries',
      locale: 'common:plugins.routing.avoidRoutes.ferries',
    },
  ],
  addressSearchUrl: '',
  minLength: 3,
  routingResponseData: {},
  searchResults: [],
}

export const getInitialState = (): RoutingState => state
