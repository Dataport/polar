import { getTooltip, Tooltip } from '@polar/lib-tooltip'
import Overlay from 'ol/Overlay'
import { Feature } from 'ol'
import { PolarActionContext, PolarStore } from '@polar/lib-custom-types'
import { DragBox } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { GfiGetters, GfiState } from '../../types'

export function setupCoreListener(
  this: PolarStore<GfiState, GfiGetters>,
  {
    getters: { gfiConfiguration },
    rootGetters,
    dispatch,
  }: PolarActionContext<GfiState, GfiGetters>
) {
  if (gfiConfiguration.featureList?.bindWithCoreHoverSelect) {
    this.watch(
      () => rootGetters.selected,
      (feature) => dispatch('setOlFeatureInformation', { feature }),
      { deep: true }
    )
  }
}

export function setupMultiSelection({
  dispatch,
  getters,
  rootGetters,
}: PolarActionContext<GfiState, GfiGetters>) {
  if (getters.gfiConfiguration.boxSelect) {
    const dragBox = new DragBox({ condition: platformModifierKeyOnly })
    dragBox.on('boxend', () =>
      dispatch('getFeatureInfo', {
        coordinateOrExtent: dragBox.getGeometry().getExtent(),
        modifierPressed: true,
      })
    )
    rootGetters.map.addInteraction(dragBox)
  }
  if (getters.gfiConfiguration.directSelect) {
    rootGetters.map.on('click', ({ coordinate, originalEvent }) =>
      dispatch('getFeatureInfo', {
        coordinateOrExtent: coordinate,
        modifierPressed:
          navigator.userAgent.indexOf('Mac') !== -1
            ? originalEvent.metaKey
            : originalEvent.ctrlKey,
      })
    )
  }
}

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
