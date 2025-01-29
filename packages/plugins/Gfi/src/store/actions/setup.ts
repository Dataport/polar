import { PolarActionContext, PolarStore } from '@polar/lib-custom-types'
import { GeoJsonProperties } from 'geojson'
import getCluster from '@polar/lib-get-cluster'
import { getTooltip, Tooltip } from '@polar/lib-tooltip'
import Overlay from 'ol/Overlay'
import { Feature } from 'ol'
import { DragBox, Draw, Modify } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { GfiGetters, GfiState } from '../../types'
import { getOriginalFeature } from '../../utils/getOriginalFeature'

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
    rootGetters.map.on('click', ({ coordinate, originalEvent }) => {
      const isDrawing = rootGetters.map
        .getInteractions()
        .getArray()
        .some(
          (interaction) =>
            // these indicate other interactions are expected now
            interaction instanceof Draw ||
            interaction instanceof Modify ||
            // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
            interaction._isDeleteSelect
        )
      if (!isDrawing) {
        dispatch('getFeatureInfo', {
          coordinateOrExtent: coordinate,
          modifierPressed: navigator.userAgent.includes('Mac')
            ? originalEvent.metaKey
            : originalEvent.ctrlKey,
        })
      }
    })
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

export function setupZoomListeners(
  this: PolarStore<GfiState, GfiGetters>,
  { dispatch, getters, rootGetters }: PolarActionContext<GfiState, GfiGetters>
) {
  if (getters.gfiConfiguration.featureList) {
    this.watch(
      () => rootGetters.zoomLevel,
      () => {
        const {
          featureInformation,
          listableLayerSources,
          visibleWindowFeatureIndex,
          windowFeatures,
        } = getters

        if (windowFeatures.length) {
          const layerId: string =
            // @ts-expect-error | if windowFeatures has features, visibleWindowFeatureIndex is in the range of possible features
            windowFeatures[visibleWindowFeatureIndex].polarInternalLayerKey
          const selectedFeatureProperties: GeoJsonProperties = {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            _gfiLayerId: layerId,
            ...featureInformation[layerId][visibleWindowFeatureIndex]
              .properties,
          }
          const originalFeature = getOriginalFeature(
            listableLayerSources,
            selectedFeatureProperties
          )
          if (originalFeature) {
            dispatch('setOlFeatureInformation', {
              feature: getCluster(
                rootGetters.map,
                originalFeature,
                '_gfiLayerId'
              ),
            })
          }
        }
      }
    )
  }
}
