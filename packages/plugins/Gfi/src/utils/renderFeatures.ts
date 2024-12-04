import VectorLayer from 'ol/layer/Vector'
import { Feature } from 'ol'
import { Geometry } from 'ol/geom'
import { FeaturesByLayerId } from '../types'
import { addFeature } from './displayFeatureLayer'
import { filterFeatures } from './filterFeatures'

export function renderFeatures(
  featureDisplayLayer: VectorLayer<Feature<Geometry>>,
  geometryLayerKeys: string[],
  features: FeaturesByLayerId
) {
  geometryLayerKeys
    .filter((key) => Array.isArray(features[key]))
    .forEach((key) =>
      filterFeatures(features)[key].forEach((feature) =>
        addFeature(feature, featureDisplayLayer)
      )
    )
}
