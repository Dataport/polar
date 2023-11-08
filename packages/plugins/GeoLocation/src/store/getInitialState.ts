import { GeoLocationState } from '../types'

const getInitialState = (): GeoLocationState => ({
  geolocation: null,
  position: [],
  tracking: false,
  isGeolocationDenied: false,
})

export default getInitialState
