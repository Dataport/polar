import { Tooltip, getTooltip } from '@polar/lib-tooltip'
import { Feature, Overlay } from 'ol'
import { vectorLayer } from '../../utils/vectorDisplay'

const localeKeys: [string, string][] = [
  ['h2', 'plugins.geometrySearch.tooltip.title'],
]

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
    const listEntries: string[] = []
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
        listEntries.push(
          `<li>${
            feature
              .get('names')
              .filter((name) => name.Typ === 'Primärer Name')
              .map((name) => `${name.Name}`)
              .join(', ') || `${feature.get('names')[0]?.Name || '???'}`
          }</li>`
        )
      },
      {
        layerFilter: (layer) => layer === vectorLayer,
      }
    )
    if (!hasFeatureAtPixel) {
      overlay.setPosition(undefined)
    } else {
      unregister?.()
      ;({ element, unregister } = getTooltip({
        localeKeys: [...localeKeys, ['ul', listEntries.join('')]],
      }))
      overlay.setElement(element)
      return true
    }
  })
}
