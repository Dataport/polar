import { Feature, MapBrowserEvent } from 'ol'
import {
  CoreGetters,
  CoreState,
  ExtendedMasterportalapiMarkers,
  MarkerStyle,
  PolarActionContext,
  PolarStore,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'
import { isVisible } from '@polar/lib-invisible-style'
import VectorLayer from 'ol/layer/Vector'
import BaseLayer from 'ol/layer/Base'
import getCluster from '@polar/lib-get-cluster'
import {
  getHoveredStyle,
  getSelectedStyle,
  getUnselectableStyle,
} from '../../../utils/markers'
import { resolveClusterClick } from '../../../utils/resolveClusterClick'
import { setLayerId } from './setLayerId'

interface UpdateSelectionPayload {
  feature: Feature | null
  centerOnFeature?: boolean
}

let lastClickEvent: MapBrowserEvent<MouseEvent> | null = null

// local copies
let hovered: Feature | null = null
let selected: Feature | null = null
let localSelectionStyle: MarkerStyle = {}

export function updateSelection(
  {
    dispatch,
    rootGetters: { map, configuration },
  }: PolarActionContext<CoreState, CoreGetters>,
  { feature, centerOnFeature = false }: UpdateSelectionPayload
) {
  if (!configuration.extendedMasterportalapiMarkers) {
    console.error(
      `@polar/core: The action 'updateSelection' can only be used if 'extendedMasterportalapiMarkers' has been configured.`
    )
    return
  }
  selected?.setStyle(undefined)
  selected = null

  if (feature === null) {
    return
  }

  const selectedCluster = getCluster(map, feature, '_gfiLayerId')

  selectedCluster.setStyle(
    getSelectedStyle(
      localSelectionStyle,
      selectedCluster.get('features')?.length > 1
    )
  )

  selected = selectedCluster
  if (centerOnFeature) {
    dispatch('centerOnFeature', selected)
  }
}

export function useExtendedMasterportalapiMarkers(
  this: PolarStore<CoreState, CoreGetters>,
  { commit, dispatch, getters }: PolarActionContext<CoreState, CoreGetters>,
  {
    hoverStyle = {},
    selectionStyle = {},
    unselectableStyle = {},
    isSelectable = () => true,
    layers,
    clusterClickZoom = false,
    dispatchOnMapSelect,
  }: ExtendedMasterportalapiMarkers
) {
  localSelectionStyle = selectionStyle
  const { map } = getters

  const layerFilter = (layer: BaseLayer): boolean =>
    layers.includes(layer.get('id'))

  map
    .getLayers()
    .getArray()
    .filter(layerFilter)
    .forEach((layer) => {
      // only vector layers reach this
      const source = (layer as VectorLayer).getSource()
      if (source !== null) {
        // @ts-expect-error | Undocumented hook.
        source.geometryFunction =
          // prevents features from jumping due to invisible features "pulling"
          (feature: Feature) =>
            isVisible(feature) ? feature.getGeometry() : null
      }
      const originalStyleFunction = (layer as VectorLayer).getStyle()
      ;(layer as VectorLayer).setStyle((feature) => {
        if (
          typeof isSelectable === 'undefined' ||
          isSelectable(feature as Feature)
        ) {
          // @ts-expect-error | always is a function due to masterportalapi design
          return originalStyleFunction(feature)
        }
        return getUnselectableStyle(
          unselectableStyle,
          feature.get('features').length > 1
        )
      })
    })

  // // // STORE EVENT HANDLING

  this.watch(
    () => getters.hovered,
    (feature: Feature | null) => {
      if (hovered !== null && hovered !== selected) {
        hovered.setStyle(undefined)
        hovered = null
      }
      if (feature !== null && feature !== selected) {
        hovered = feature
        const isMultiFeature = hovered.get('features')?.length > 1
        hovered.setStyle(getHoveredStyle(hoverStyle, isMultiFeature))
      }
    }
  )

  // // // MAP EVENT HANDLING

  // on zoom change, re-select since cluster was updated
  let lastZoom = map.getView().getZoom()
  map.on('moveend', function () {
    const zoom = map.getView().getZoom()
    if (zoom !== lastZoom) {
      lastZoom = zoom
      if (selected) {
        const baseFeature = selected.get('features')?.[0] || selected
        setLayerId(map, baseFeature)
        dispatch('updateSelection', { feature: baseFeature })
      }
    }
  })

  map.on('pointermove', function (event) {
    const feature = map.getFeaturesAtPixel(event.pixel, { layerFilter })[0]
    if (feature === selected || feature instanceof RenderFeature) {
      return
    }
    if (hovered !== null && hovered !== selected) {
      hovered.setStyle(undefined)
      hovered = null
      commit('setHovered', hovered)
    }
    if (!feature || !isSelectable(feature)) {
      return
    }
    const isMultiFeature = feature.get('features')?.length > 1
    setLayerId(map, feature)
    hovered = feature
    commit('setHovered', hovered)
    feature.setStyle(getHoveredStyle(hoverStyle, isMultiFeature))
  })

  map.on('click', function (event) {
    if (selected !== null) {
      selected.setStyle(undefined)
      selected = null
      commit('setSelected', selected)
      dispatch('updateSelection', { feature: selected })
    }
    const feature = map.getFeaturesAtPixel(event.pixel, { layerFilter })[0]
    if (
      !feature ||
      feature instanceof RenderFeature ||
      !isSelectable(feature)
    ) {
      return
    }
    const isMultiFeature = feature.get('features')?.length > 1
    lastClickEvent = event
    event.stopPropagation()
    if (
      clusterClickZoom &&
      isMultiFeature &&
      map.getView().getZoom() !== map.getView().getMaxZoom()
    ) {
      resolveClusterClick(map, feature)
    } else {
      setLayerId(map, feature)
      selected = feature
      if (dispatchOnMapSelect) {
        dispatch(...dispatchOnMapSelect)
      }
      hovered?.setStyle?.(undefined)
      hovered = null
      commit('setHovered', null)
      commit('setSelected', selected)
      selected.setStyle(getSelectedStyle(localSelectionStyle, isMultiFeature))
      dispatch('updateSelection', { feature: selected, centerOnFeature: true })
      dispatch('centerOnFeature', selected)
    }
  })

  /* click leads to singlelick; if an element is selected, to not let other
   * plugins pick it up, something was already done with it */
  map.on('singleclick', function (event) {
    if (event?.originalEvent === lastClickEvent?.originalEvent) {
      event.stopPropagation()
    }
  })
}
