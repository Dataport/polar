import { Feature, Map } from 'ol'
import VectorLayer from 'ol/layer/Vector'

// returns feature if it's a cluster feature, or the cluster the feature is in.
export default function (map: Map, feature: Feature, layerId: string): Feature {
  if (feature.get('features')) {
    return feature
  }

  const layer = map
    .getLayers()
    .getArray()
    .find((layer) => layer.get('id') === feature.get(layerId))

  if (!(layer instanceof VectorLayer)) {
    throw new Error(
      `@polar/lib-get-cluster: The layer with the id ${layerId} either does not exist or is not a VectorLayer.`
    )
  }

  const cluster = layer
    .getSource()
    .getFeatures()
    .find((candidate: Feature) => candidate.get('features').includes(feature))

  if (!(cluster instanceof Feature)) {
    throw new Error(
      '@polar/lib-get-cluster: No cluster could be found for the given feature.'
    )
  }
  // The given feature should be the last in the array, as it the one "above" all thus added last
  cluster.set('features', [
    ...cluster.get('features').filter((f: Feature) => f !== feature),
    feature,
  ])
  // true = silent change (prevents cluster recomputation & rerender)
  cluster.set(layerId, feature.get(layerId), true)
  return cluster
}
