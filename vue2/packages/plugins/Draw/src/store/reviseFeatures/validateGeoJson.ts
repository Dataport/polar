import { FeatureCollection } from 'geojson'
import { booleanValid } from '@turf/boolean-valid'
import { GeometryType } from '../../types'

export const validateGeoJson = (
  featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> => ({
  ...featureCollection,
  features: featureCollection.features.map((feature) => ({
    ...feature,
    properties: {
      ...(feature.properties ?? {}),
      sfaValidity: booleanValid(feature),
    },
  })),
})
