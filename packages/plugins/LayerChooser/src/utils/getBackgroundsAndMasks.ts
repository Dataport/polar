import { rawLayerList } from '@masterportal/masterportalapi'
import { LayerConfiguration, MapConfig } from '@polar/lib-custom-types'

export const getBackgroundsAndMasks = (
  configuration: MapConfig
): [LayerConfiguration[], LayerConfiguration[]] =>
  configuration.layers.reduce(
    ([backgrounds, masks], current) => {
      const rawLayer = rawLayerList.getLayerWhere({
        id: current.id,
      })

      if (rawLayer === null) {
        console.error(
          `@polar/plugin-layer-chooser: Layer ${current.id} not found in service register. This is a configuration issue. The map might behave in unexpected ways.`,
          current
        )

        return [backgrounds, masks]
      }
      if (current.type === 'background') {
        return [[...backgrounds, current], masks]
      }

      return [backgrounds, [...masks, current]]
    },
    [[] as LayerConfiguration[], [] as LayerConfiguration[]]
  )
