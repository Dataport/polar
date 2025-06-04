import { Feature } from 'geojson'

// a little clunky, but this has been established
export type ReverseGeocoderFeature = Omit<Feature, 'type'> & {
  type: 'reverse_geocoded'
  title: string
  addressGeometry: Feature['geometry']
}
