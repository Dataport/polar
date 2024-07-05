import merge from 'lodash.merge'
import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import '@polar/core/styles.css'
import AddressSearch from '@polar/plugin-address-search'
import '@polar/plugin-address-search/styles.css'
import Attributions from '@polar/plugin-attributions'
import '@polar/plugin-attributions/styles.css'
import Draw from '@polar/plugin-draw'
import '@polar/plugin-draw/styles.css'
import Export from '@polar/plugin-export'
import '@polar/plugin-export/styles.css'
import Fullscreen from '@polar/plugin-fullscreen'
import '@polar/plugin-fullscreen/styles.css'
import GeoLocation from '@polar/plugin-geo-location'
import '@polar/plugin-geo-location/styles.css'
import Gfi from '@polar/plugin-gfi'
import '@polar/plugin-gfi/styles.css'
import IconMenu from '@polar/plugin-icon-menu'
import '@polar/plugin-icon-menu/styles.css'
import LayerChooser from '@polar/plugin-layer-chooser'
import '@polar/plugin-layer-chooser/styles.css'
import Legend from '@polar/plugin-legend'
import '@polar/plugin-legend/styles.css'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import '@polar/plugin-loading-indicator/styles.css'
import Pins from '@polar/plugin-pins'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
import Scale from '@polar/plugin-scale'
import '@polar/plugin-scale/styles.css'
import Toast from '@polar/plugin-toast'
import '@polar/plugin-toast/styles.css'
import Zoom from '@polar/plugin-zoom'
import '@polar/plugin-zoom/styles.css'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

// this is acceptable for list-like functions
// eslint-disable-next-line max-lines-per-function
export const addPlugins = (core) => {
  setLayout(NineLayout)

  const iconMenu = IconMenu({
    menus: [
      {
        plugin: LayerChooser({}),
        icon: 'fa-layer-group',
        id: 'layerChooser',
      },
      {
        plugin: Draw({}),
        icon: 'fa-pencil',
        id: 'draw',
      },
      {
        plugin: Zoom({ renderType: 'iconMenu' }),
        id: 'zoom',
      },
      {
        plugin: Fullscreen({ renderType: 'iconMenu' }),
        id: 'fullscreen',
      },
      {
        plugin: GeoLocation({ renderType: 'iconMenu' }),
        id: 'geoLocation',
      },
      {
        plugin: Attributions({
          renderType: 'iconMenu',
          listenToChanges: [
            'plugin/zoom/zoomLevel',
            'plugin/layerChooser/activeBackgroundId',
            'plugin/layerChooser/activeMaskIds',
          ],
        }),
        icon: 'fa-regular fa-copyright',
        id: 'attributions',
      },
    ],
    displayComponent: true,
    initiallyOpen: 'layerChooser',
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })

  core.addPlugins([
    AddressSearch(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_LEFT,
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      })
    ),
    iconMenu,
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
    Legend({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
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
        toastAction: 'plugin/toast/addToast',
      })
    ),
    Gfi(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_LEFT,
      })
    ),
    ReverseGeocoder({
      url: 'https://geodienste.hamburg.de/HH_WPS',
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      coordinateSource: 'plugin/pins/transformedCoordinate',
      addressTarget: 'plugin/addressSearch/selectResult',
      zoomTo: 7,
    }),
  ])
}
