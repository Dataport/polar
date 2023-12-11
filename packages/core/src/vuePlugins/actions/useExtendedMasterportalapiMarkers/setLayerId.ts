import { Feature, Map } from 'ol'
import Cluster from 'ol/source/Cluster'
import VectorLayer from 'ol/layer/Vector'
import BaseLayer from 'ol/layer/Base'
import VectorSource from 'ol/source/Vector'

// key `_gfiLayerId` required for GFI plugin interconnection
export const setLayerId = (map: Map, feature: Feature): void => {
  const layerId = map
    .getLayers()
    .getArray()
    .find((layer) => {
      // @ts-expect-error | That's why we check, some children have it.
      if (layer.getSource) {
        let step:
          | BaseLayer
          | VectorLayer<VectorSource>
          | VectorSource
          | Cluster = layer
        while (step instanceof VectorLayer || step instanceof Cluster) {
          step = step.getSource()
          // @ts-expect-error | We just checked.
          if (step.hasFeature(feature)) {
            return true
          }
        }
        // @ts-expect-error | We just checked.
        return Boolean(step?.hasFeature?.(feature))
      }
      return false
    })
    ?.get('id')
  if (layerId) {
    feature.set('_gfiLayerId', layerId, true)
  }
}
