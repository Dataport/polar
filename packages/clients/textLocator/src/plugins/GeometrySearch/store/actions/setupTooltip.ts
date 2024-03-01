import { Tooltip, getTooltip } from '@polar/lib-tooltip'
import { Feature, Overlay } from 'ol'
import { vectorLayer } from '../../utils/vectorDisplay'

export function setupTooltip({ rootGetters: { map } }) {
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
    const localeKeys: [string, string][] = [
      ['h2', 'plugins.geometrySearch.tooltip.title'],
    ]
    // TODO do not list every name separately,
    map.forEachFeatureAtPixel(
      pixel,
      (feature) => {
        if (!(feature instanceof Feature)) {
          return false
        }
        if (!hasFeatureAtPixel) {
          hasFeatureAtPixel = true
          overlay.setPosition(map.getCoordinateFromPixel(pixel))
        }
        localeKeys.push([
          'ul',
          feature
            .get('names')
            .map((name) => `<li>${name.Name}</li>`)
            .join(''),
        ])
      },
      {
        layerFilter: (layer) => layer === vectorLayer,
      }
    )
    if (!hasFeatureAtPixel) {
      overlay.setPosition(undefined)
    } else {
      unregister?.()
      ;({ element, unregister } = getTooltip({ localeKeys }))
      overlay.setElement(element)
      return true
    }
  })
}
