import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
  route: [],
  travelMode: '',
  displayPreferredRoute: false,
  preferredRoute: '',
  displayRouteTypesToAvoid: false,
  serviceID: '',
  numberOfKeysToTriggerSearch: 3,
  // SearchResults.NO_SEARCH
  searchResults: [],
})
