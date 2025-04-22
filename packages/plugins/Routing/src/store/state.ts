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
  serviceID: '',
  queryParameters: {
    searchAddress: true,
    searchStreets: true,
    searchHouseNumbers: true,
  },
  searchInput: '',
  addressSearchUrl: '',
  minLength: 3,
  waitMs: 300,
  routingResponseData: {},
  searchResults: [],
  mousePosition: [],
}

export const getInitialState = (): RoutingState => state
