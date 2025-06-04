import { FeatureCollection } from 'geojson'
import { GeometryType } from '../../types'

// FeatureCollection is compatible to stupid clone
export const cloneFeatureCollection = (
  // No GeometryCollection from Draw, hence the <GeometryType>
  featureCollection: FeatureCollection<GeometryType>
): FeatureCollection<GeometryType> =>
  JSON.parse(JSON.stringify(featureCollection))
