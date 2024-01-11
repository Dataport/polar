import { Vector as VectorLayer } from 'ol/layer'
import BaseLayer from 'ol/layer/Base'

export const listableLayersFilter = (layer: BaseLayer): boolean =>
  Boolean(
    layer instanceof VectorLayer ||
      console.warn(
        `@polar/plugin-gfi: Layer ${layer.get(
          'id'
        )} will not produce list results since it is not a vector layer.`
      )
  )
