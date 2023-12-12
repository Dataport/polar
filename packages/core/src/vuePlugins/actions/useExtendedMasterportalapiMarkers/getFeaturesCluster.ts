import { Feature, Map } from 'ol'

// returns feature if it's a cluster feature, or the cluster the feature is in
export const getFeaturesCluster = (
  map: Map | null,
  feature: Feature
): Feature | null =>
  map
    ? feature.get('features')
      ? feature
      : // @ts-expect-error | The layer with the id '_gfiLayerId' is defined if this action is called
        map
          .getLayers()
          .getArray()
          .find((layer) => layer.get('id') === feature.get('_gfiLayerId'))
          // @ts-expect-error | The gfi layer has a source defined if this action is called
          .getSource()
          .getFeaturesInExtent(
            map.getView().calculateExtent(map.getSize()),
            map.getView().getProjection()
          )
          .find((candidate) => candidate.get('features').includes(feature)) ||
        null
    : null
