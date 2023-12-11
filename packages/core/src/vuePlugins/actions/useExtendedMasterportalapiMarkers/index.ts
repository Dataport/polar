import { Feature, Map, MapBrowserEvent } from 'ol'
import {
  CoreGetters,
  CoreState,
  MarkerStyle,
  PolarActionContext,
} from '@polar/lib-custom-types'
import RenderFeature from 'ol/render/Feature'
import { isVisible } from '@polar/lib-invisible-style'
import { Store } from 'vuex'
import { Point } from 'ol/geom'
import { easeOut } from 'ol/easing'
import { getHoveredStyle, getSelectedStyle } from '../../../utils/markers'
import { resolveClusterClick } from '../../../utils/resolveClusterClick'

// TODO pull file apart (after changes in other PR are through)

let lastClickEvent: MapBrowserEvent<MouseEvent> | null = null

// local copies
let hovered: Feature | null = null
let selected: Feature | null = null

// key `_gfiLayerId` required for GFI plugin interconnection
const setLayerId = (map: Map, feature: Feature): void => {
  const layerId = map
    .getLayers()
    .getArray()
    .find((layer) => {
      // @ts-expect-error | That's why we check, some children have it.
      if (layer.getSource) {
        let step = layer
        // @ts-expect-error | Just checked.
        while (step.getSource) {
          // @ts-expect-error | Just checked.
          step = step.getSource()
        }
        // @ts-expect-error | If getSource is there, so is hasFeature.
        return step.hasFeature?.(feature)
      }
      return false
    })
    ?.get('id')
  if (layerId) {
    feature.set('_gfiLayerId', layerId, true)
  }
}

const center = (map: Map, selected: Feature | null) => {
  if (selected !== null) {
    map.getView().animate({
      center: (selected.getGeometry() as Point).getCoordinates(),
      duration: 400,
      easing: easeOut,
    })
  }
}

// eslint-disable-next-line max-lines-per-function
export function useExtendedMasterportalapiMarkers(
  this: Store<CoreState>,
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

  const updateSelection = (feature: Feature | null) => {
    if (feature === null) {
      selected?.setStyle(undefined)
      selected = null
      return
    }

    let selectedCluster = feature.get('features') ? feature : null

    if (selectedCluster === null) {
      // @ts-expect-error | Really, it's there!
      const candidates = map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === feature.get('_gfiLayerId'))
        // @ts-expect-error | Really, it's there!
        .getSource()
        .getFeaturesInExtent(
          map.getView().calculateExtent(map.getSize()),
          map.getView().getProjection()
        )

      selectedCluster = candidates.find((candidate) =>
        candidate.get('features').includes(feature)
      )
    }

    selectedCluster?.setStyle(
      getSelectedStyle(
        selectionStyle,
        selectedCluster.get('features')?.length > 1
      )
    )
    selected = selectedCluster
    center(map, selected)
  }

  // on zoom change, re-select since cluster was updated
  let lastZoom = map.getView().getZoom()
  map.on('moveend', function () {
    const zoom = map.getView().getZoom()
    if (zoom !== lastZoom) {
      lastZoom = zoom
      if (selected) {
        const baseFeature = selected.get('features')?.[0] || selected
        setLayerId(map, baseFeature)
        updateSelection(baseFeature)
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

  this.watch(() => getters.selected, updateSelection)

  // // // MAP EVENT HANDLING

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
    const feature = map.getFeaturesAtPixel(event.pixel, {
      layerFilter: (layer) => layers.includes(layer.get('id')),
    })[0]
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
