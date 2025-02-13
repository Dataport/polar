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
    }
    return accumulator
  }, [] as Snap[])
