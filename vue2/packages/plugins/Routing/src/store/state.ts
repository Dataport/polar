import { FeatureCollection, LineString } from 'geojson'
import { RoutingState } from '../types'

export const getInitialState = (): RoutingState => ({
	routingResponseData: {} as FeatureCollection<LineString>,
	showSteps: false,
})
