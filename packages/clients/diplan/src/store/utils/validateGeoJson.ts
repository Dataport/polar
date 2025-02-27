import { FeatureCollection } from 'geojson'
import { booleanValid } from '@turf/boolean-valid'

export const validateGeoJson = (featureCollection: FeatureCollection) =>
  featureCollection.features.every((feature) => booleanValid(feature))
