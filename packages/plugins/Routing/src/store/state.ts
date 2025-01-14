import { RoutingState } from '../types'
const state = {
  start: [],
  startAddress: '',
  end: [],
  endAddress: '',
  selectedTravelMode: '',
  selectableTravelModes: [
    { key: 'car', localKey: 'common:plugins.routing.travelMode.car' },
    { key: 'hgv', localKey: 'common:plugins.routing.travelMode.hgv' },
    { key: 'bike', localKey: 'common:plugins.routing.travelMode.bike' },
    { key: 'walking', localKey: 'common:plugins.routing.travelMode.walking' },
    {
      key: 'wheelchair',
      localKey: 'common:plugins.routing.travelMode.wheelchair',
    },
  ],
  displayPreferences: false,
  selectedPreference: '',
  selectablePreferences: [
    {
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
  searchResponseData: {},
  mousePosition: [],
}

export const getInitialState = (): RoutingState => state
