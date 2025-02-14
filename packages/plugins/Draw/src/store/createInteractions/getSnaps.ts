import { Map } from 'ol'
import { Snap } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'

export const getSchnaps = (map: Map, snapIds: string[]): Snap[] =>
  snapIds.reduce((accumulator, layerId) => {
    const source = (
      map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === layerId) as VectorLayer
    )?.getSource?.()
    if (source) {
      accumulator.push(new Snap({ source }))
    } else {
      console.warn(
        `@polar/plugin-draw: Layer with ID "${layerId}" configured for 'snapTo', but it has no source to snap to. The layer does probably not hold any vector data.`
      )
    }
    return accumulator
  }, [] as Snap[])
