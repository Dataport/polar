import { Vector as VectorLayer } from 'ol/layer'
import BaseLayer from 'ol/layer/Base'

export const listableLayersFilter = (layer: BaseLayer): boolean =>
  Boolean(
    layer instanceof VectorLayer ||
      console.warn(
        `Layer ${layer.get(
          'id'
        )} in GFI plugin will not produce list results since it is not a vector layer.`
      )
  )
