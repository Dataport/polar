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

  return layer
    .getSource()
    .getFeaturesInExtent(
      map.getView().calculateExtent(map.getSize()),
      map.getView().getProjection()
    )
    .find((candidate: Feature) => candidate.get('features').includes(feature))
}
