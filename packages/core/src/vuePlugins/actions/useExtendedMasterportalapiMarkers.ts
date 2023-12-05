import { Feature, MapBrowserEvent } from 'ol'
import {
  CoreGetters,
  CoreState,
  PolarActionContext,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'
import {
  MarkerStyle,
  getHoveredStyle,
  getSelectedStyle,
} from '../../utils/markers'

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
  }: {
    hoverStyle?: MarkerStyle
    selectionStyle?: MarkerStyle
    layers: string[]
  }
) {
  const { map } = getters

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
    selected = feature
    commit('setSelected', selected)
    selected.setStyle(getSelectedStyle(selectionStyle, isMultiFeature))
    lastClickEvent = event
    event.stopPropagation()
  })
  /* click leads to singlelick; if an element is selected, to not let other
   * plugins pick it up, something was already done with it */
  map.on('singleclick', function (event) {
    if (event?.originalEvent === lastClickEvent?.originalEvent) {
      event.stopPropagation()
    }
  })
}
