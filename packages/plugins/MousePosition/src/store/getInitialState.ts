import { GeoLocationState } from '../types'

const getInitialState = (): GeoLocationState => ({
  projections: [],
  selectedProjection: '',
  mousePosition: [],
})

export default getInitialState
