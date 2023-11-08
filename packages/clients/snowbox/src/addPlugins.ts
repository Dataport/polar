import merge from 'lodash.merge'
import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import Export from '@polar/plugin-export'
import Fullscreen from '@polar/plugin-fullscreen'
import GeoLocation from '@polar/plugin-geo-location'
import Gfi from '@polar/plugin-gfi'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import Legend from '@polar/plugin-legend'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

export const addPlugins = (core) => {
  setLayout(NineLayout)

  const iconMenu = IconMenu(
    merge({}, defaultOptions, {
      menus: [
        {
          plugin: LayerChooser({}),
          icon: 'fa-book-atlas',
          id: 'layerChooser',
        },
        {
          plugin: Draw({}),
          icon: 'fa-pencil',
          id: 'draw',
        },
      ],
      layoutTag: NineLayoutTag.TOP_RIGHT,
    })
  )

  core.addPlugins([
    AddressSearch(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_LEFT,
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      })
    ),
    iconMenu,
    Zoom(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_RIGHT,
      })
    ),
    Fullscreen(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_RIGHT,
      })
    ),
    GeoLocation(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_RIGHT,
      })
    ),
    Legend(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        maxWidth: 500,
      })
    ),
    Attributions(
      merge({}, defaultOptions, {
        windowLength: 450,
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        listenToChanges: [
          'plugin/zoom/zoomLevel',
          'plugin/layerChooser/activeBackgroundId',
          'plugin/layerChooser/activeMaskIds',
        ],
      })
    ),
    Export(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_LEFT,
      })
    ),
    LoadingIndicator(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      })
    ),
    Scale(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      })
    ),
    Toast(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
      })
    ),
    Pins(
      merge({}, defaultOptions, {
        appearOnClick: { show: true, atZoomLevel: 6 },
        coordinateSource: 'plugin/addressSearch/chosenAddress',
      })
    ),
    Gfi(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_LEFT,
      })
    ),
  ])
}
