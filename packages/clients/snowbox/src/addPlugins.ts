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
import PointerPosition from '@polar/plugin-pointer-position'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
import Routing from '@polar/plugin-routing'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

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
        plugin: Routing({
          // Will be set later
          apiKey: '',
          url: 'https://api.openrouteservice.org/v2/directions/',
          format: 'geojson',
          type: 'ors',
        }),
        icon: 'fa-route',
        id: 'routing',
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
    Pins({
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
      toastAction: 'plugin/toast/addToast',
    }),
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
    PointerPosition(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_LEFT,
      })
    ),
  ])
}
