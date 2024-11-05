import { GeoLocationState } from '../types'

const getInitialState = (): GeoLocationState => ({
  geolocation: null,
  position: [],
  tracking: false,
  isGeolocationDenied: false,
  boundaryCheck: null,
})

export default getInitialState
