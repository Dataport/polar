import { Map } from 'ol'
import { Snap } from 'ol/interaction'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

export const getSnaps = (map: Map, snapIds: string[]): Snap[] =>
  snapIds.reduce((accumulator, layerId) => {
    const layer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get('id') === layerId) as VectorLayer
    const source = layer?.getSource?.()
    if (source instanceof VectorSource) {
      const snap = new Snap({ source })
      const visibilityToggler = () => snap.setActive(layer.getVisible())
      layer.on('propertychange', visibilityToggler)
      visibilityToggler()
      // @ts-expect-error | riding piggyback
      snap._onRemove = () => layer.un('propertychange', visibilityToggler)
      accumulator.push(snap)
    } else {
      console.warn(
        `@polar/plugin-draw: Layer with ID "${layerId}" configured for 'snapTo', but it has no source to snap to. The layer does probably not hold any vector data.`
      )
    }
    return accumulator
  }, [] as Snap[])
