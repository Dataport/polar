import { FeatureCollection, LineString } from 'geojson'
import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
  currentlyFocusedInput: -1,
  route: [[], []],
  routingResponseData: {} as FeatureCollection<LineString>,
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
  selectedPreference: 'recommended',
  selectedRouteTypesToAvoid: [],
  selectedTravelMode: 'driving-car',
  showSteps: false,
})
