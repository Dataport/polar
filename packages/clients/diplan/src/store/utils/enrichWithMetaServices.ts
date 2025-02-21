import { FeatureCollection } from 'geojson'
import { Map } from 'ol'
import { MetaService } from '../../types'

export const enrichWithMetaServices = (
  featureCollection: FeatureCollection,
  map: Map,
  metaServices: MetaService[]
) => {
  return featureCollection
}
