import { getTooltip, Tooltip } from '@polar/lib-tooltip'
import Overlay from 'ol/Overlay'
import { Feature } from 'ol'
import { PolarActionContext } from '@polar/lib-custom-types'
import { GfiGetters, GfiState } from '../../types'

export function setupTooltip({
  getters: { gfiConfiguration },
  rootGetters: { map },
}: PolarActionContext<GfiState, GfiGetters>) {
  const tooltipLayerIds = Object.keys(gfiConfiguration.layers).filter(
    (key) => gfiConfiguration.layers[key].showTooltip
  )
  if (!tooltipLayerIds.length) {
    return
  }

  let element: Tooltip['element'], unregister: Tooltip['unregister']
  const overlay = new Overlay({
    positioning: 'bottom-center',
    offset: [0, -5],
  })
  map.addOverlay(overlay)
  map.on('pointermove', ({ pixel, dragging, originalEvent }) => {
    if (dragging || ['touch', 'pen'].includes(originalEvent.pointerType)) {
      return
    }
    let hasFeatureAtPixel = false
    // stops on return `true`, thus only using the uppermost feature
    map.forEachFeatureAtPixel(
      pixel,
      (feature, layer) => {
        if (!(feature instanceof Feature)) {
          return false
        }
        hasFeatureAtPixel = true
        overlay.setPosition(map.getCoordinateFromPixel(pixel))
        if (unregister) {
          unregister()
        }
        ;({ element, unregister } = getTooltip({
          localeKeys:
            // @ts-expect-error | it exists by virtue of layerFilter below
            gfiConfiguration.layers[layer.get('id')].showTooltip(feature, map),
        }))
        overlay.setElement(element)
        return true
      },
      { layerFilter: (layer) => tooltipLayerIds.includes(layer.get('id')) }
    )
    if (!hasFeatureAtPixel) {
      overlay.setPosition(undefined)
    }
  })
}
