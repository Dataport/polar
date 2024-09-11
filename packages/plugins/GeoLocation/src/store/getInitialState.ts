import { GeoLocationState } from '../types'

const getInitialState = (): GeoLocationState => ({
  geolocation: null,
  position: [],
  tracking: false,
  isGeolocationDenied: false,
  boundaryCheck: null,
  boundaryCheckChanged: true,
})

export default getInitialState
