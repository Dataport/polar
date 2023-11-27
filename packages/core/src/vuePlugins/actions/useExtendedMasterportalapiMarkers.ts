import { Feature, MapBrowserEvent } from 'ol'
import Style from 'ol/style/Style'
import Icon from 'ol/style/Icon'
import {
  CoreGetters,
  CoreState,
  PolarActionContext,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'

const fallbackHoverFill = '#008A8A'
const fallbackSelectionFill = '#00A95C'

export const imgSize = [23, 32]
export const imgSizeMulti = [35, 32]

const prefix = 'data:image/svg+xml,'

/* Path of marker svg used in this file copied and adapted from
 * @masterportal/masterportalapi/public/marker.svg. */

const makeMarker = ({ stroke = '#FFF', strokeWidth = '2', fill = '#005CA9' }) =>
  `${prefix}${encodeURIComponent(`
<svg width="${imgSize[0]}" height="${imgSize[1]}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>DB6C494E-88E8-49F1-89CE-97CBEC3A5240</title>
  <path
    d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
    fill="${fill}"
    fill-rule="nonzero"
  />
</svg>
`)}`

/* TODO use for clusters
const makeMultiMarker = ({
  stroke = '#FFF',
  strokeWidth = '2',
  fill = '#005CA9',
}) =>
  `${prefix}${encodeURIComponent(`
<svg width="${imgSizeMulti[0]}" height="${imgSizeMulti[1]}" viewBox="0 0 30 43" xmlns="http://www.w3.org/2000/svg">
  <title>0A6F4952-4A5A-4E86-88E4-4B3D2EA1E3DF</title>
  <g stroke="${stroke}" stroke-width="${strokeWidth}" fill="${fill}" fill-rule="nonzero">
    <path d="M22.584 1C15.101 1 9 7.101 9 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C36.168 7.054 30.068 1 22.584 1z"/>
    <path d="M18.584 1C11.101 1 5 7.101 5 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C32.168 7.054 26.068 1 18.584 1z"/>
    <path d="M14.584 1C7.101 1 1 7.101 1 14.584c0 8.103 7.865 20.448 11.63 25.93a2.36 2.36 0 0 0 3.908 0c3.766-5.482 11.63-17.922 11.63-25.93C28.168 7.054 22.068 1 14.584 1z"/>
  </g>
</svg>
`)}`
*/

// center bottom of marker 📍 is intended to show the spot
const anchor = [0.5, 1]

const hoverStyle = (hoverFill = fallbackHoverFill) =>
  new Style({
    image: new Icon({
      src: makeMarker({ fill: hoverFill }),
      anchor,
    }),
  })

const selectedStyle = (selectionFill = fallbackSelectionFill) =>
  new Style({
    image: new Icon({
      src: makeMarker({ fill: selectionFill }),
      anchor,
    }),
  })

let lastClickEvent: MapBrowserEvent<MouseEvent> | null = null

// local copies
let hovered: Feature | null = null
let selected: Feature | null = null

// eslint-disable-next-line max-lines-per-function
export function useExtendedMasterportalapiMarkers(
  { getters, commit }: PolarActionContext<CoreState, CoreGetters>,
  {
    hoverFill,
    layers,
    selectionFill,
  }: {
    hoverFill?: string
    layers: string[]
    selectionFill?: string
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
    hovered = feature
    commit('setHovered', hovered)
    feature.setStyle(hoverStyle(hoverFill))
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
    selected = feature
    commit('setSelected', selected)
    selected.setStyle(selectedStyle(selectionFill))
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
