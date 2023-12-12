import { Feature, Map } from 'ol'
import Cluster from 'ol/source/Cluster'
import VectorLayer from 'ol/layer/Vector'
import BaseLayer from 'ol/layer/Base'
import VectorSource from 'ol/source/Vector'

// key `_gfiLayerId` required for GFI plugin interconnection
export const setLayerId = (map: Map, feature: Feature): void => {
  if (feature.get('_gfiLayerId')) {
    return
  }
  const layerId = map
    .getLayers()
    .getArray()
    .find((layer) => {
      if (layer instanceof VectorLayer) {
        let step: VectorLayer<VectorSource> | VectorSource | Cluster = layer
        while (step instanceof VectorLayer || step instanceof Cluster) {
          // @ts-expect-error | Clusters in masterportalapi always have a source.
          step = step.getSource()
          // @ts-expect-error | It's not a vector layer anymore.
          if (step.hasFeature(feature)) {
            return true
          }
        }
        return Boolean(step?.hasFeature?.(feature))
      }
      return false
    })
    ?.get('id')
  if (layerId) {
    feature.set('_gfiLayerId', layerId, true)
  }
}
