import { Feature, Map, MapBrowserEvent } from 'ol'
import {
  CoreGetters,
  CoreState,
  MarkerStyle,
  PolarActionContext,
  PolarStore,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'
import { isVisible } from '@polar/lib-invisible-style'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import BaseLayer from 'ol/layer/Base'
import { getHoveredStyle, getSelectedStyle } from '../../../utils/markers'
import { resolveClusterClick } from '../../../utils/resolveClusterClick'
import { setLayerId } from './setLayerId'
import { center } from './center'
import { getFeaturesCluster } from './getFeaturesCluster'

let lastClickEvent: MapBrowserEvent<MouseEvent> | null = null

// local copies
let hovered: Feature | null = null
let selected: Feature | null = null

const updateSelection = (
  map: Map,
  feature: Feature | null,
  selectionStyle: MarkerStyle
) => {
  if (feature === null) {
    selected?.setStyle(undefined)
    selected = null
    return
  }

  const selectedCluster = getFeaturesCluster(map, feature)

  selectedCluster?.setStyle(
    getSelectedStyle(
      selectionStyle,
      selectedCluster.get('features')?.length > 1
    )
  )

  selected = selectedCluster
  center(map, selected)
}

// eslint-disable-next-line max-lines-per-function
export function useExtendedMasterportalapiMarkers(
  this: PolarStore<CoreState, CoreGetters>,
  { getters, dispatch, commit }: PolarActionContext<CoreState, CoreGetters>,
  {
    hoverStyle = {},
    selectionStyle = {},
    layers,
    clusterClickZoom = false,
    dispatchOnMapSelect,
  }: {
    hoverStyle?: MarkerStyle
    selectionStyle?: MarkerStyle
    layers: string[]
    clusterClickZoom: boolean
    dispatchOnMapSelect?: string[]
  }
) {
  const { map } = getters

  const layerFilter = (layer: BaseLayer): boolean =>
    layers.includes(layer.get('id'))

  map
    .getLayers()
    .getArray()
    .filter(layerFilter)
    .forEach((layer) => {
      // only vector layers reach this
      const source = (layer as VectorLayer<VectorSource>).getSource()
      if (source !== null) {
        // @ts-expect-error | Undocumented hook.
        source.geometryFunction =
          // prevents features from jumping due to invisible features "pulling"
          (feature) => (isVisible(feature) ? feature.getGeometry() : null)
      }
    })

  // on zoom change, re-select since cluster was updated
  let lastZoom = map.getView().getZoom()
  map.on('moveend', function () {
    const zoom = map.getView().getZoom()
    if (zoom !== lastZoom) {
      lastZoom = zoom
      if (selected) {
        const baseFeature = selected.get('features')?.[0] || selected
        setLayerId(map, baseFeature)
        updateSelection(map, baseFeature, selectionStyle)
      }
    }
  })

  // // // STORE EVENT HANDLING

  this.watch(
    () => getters.hovered,
    (feature: Feature | null) => {
      console.warn('TODO core reaction to list hover', feature)
    }
  )

  this.watch(
    () => getters.selected,
    (feature) => updateSelection(map, feature, selectionStyle)
  )

  // // // MAP EVENT HANDLING

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
    if (!feature) {
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
    }
    const feature = map.getFeaturesAtPixel(event.pixel, { layerFilter })[0]
    if (!feature || feature instanceof RenderFeature) {
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
        // @ts-expect-error | May be one or two elements, no fixed tuple.
        dispatch(...dispatchOnMapSelect)
      }
      hovered?.setStyle?.(undefined)
      hovered = null
      commit('setHovered', null)
      commit('setSelected', selected)
      selected.setStyle(getSelectedStyle(selectionStyle, isMultiFeature))
      center(map, selected)
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
