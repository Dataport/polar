import { Feature, MapBrowserEvent } from 'ol'
import {
  CoreGetters,
  CoreState,
  PolarActionContext,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'
import { isVisible } from '@polar/lib-invisible-style'
import {
  MarkerStyle,
  getHoveredStyle,
  getSelectedStyle,
} from '../../utils/markers'
import { resolveClusterClick } from '../../utils/resolveClusterClick'

let lastClickEvent: MapBrowserEvent<MouseEvent> | null = null

// local copies
let hovered: Feature | null = null
let selected: Feature | null = null

// eslint-disable-next-line max-lines-per-function
export function useExtendedMasterportalapiMarkers(
  { getters, commit }: PolarActionContext<CoreState, CoreGetters>,
  {
    hoverStyle = {},
    selectionStyle = {},
    layers,
    clusterClickZoom = false,
  }: {
    hoverStyle?: MarkerStyle
    selectionStyle?: MarkerStyle
    layers: string[]
    clusterClickZoom: boolean
  }
) {
  const { map } = getters

  // prevents features from jumping due to invisible features "pulling"
  map
    .getLayers()
    .getArray()
    .filter((layer) => layers.includes(layer.get('id')))
    .forEach((layer) => {
      // @ts-expect-error | only vector layers reach this
      layer.getSource().geometryFunction = (feature) =>
        isVisible(feature) ? feature.getGeometry() : null
    })

  map.on('pointermove', function (event) {
    const feature = map.getFeaturesAtPixel(event.pixel, {
      layerFilter: (layer) => layers.includes(layer.get('id')),
    })[0]
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
    const feature = map.getFeaturesAtPixel(event.pixel, {
      layerFilter: (layer) => layers.includes(layer.get('id')),
    })[0]
    if (!feature || feature instanceof RenderFeature) {
      return
    }
    const isMultiFeature = feature.get('features')?.length > 1
    lastClickEvent = event
    event.stopPropagation()
    if (clusterClickZoom && isMultiFeature) {
      resolveClusterClick(map, feature)
    } else {
      selected = feature
      commit('setSelected', selected)
      selected.setStyle(getSelectedStyle(selectionStyle, isMultiFeature))
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
