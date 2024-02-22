import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import '@polar/core/styles.css'
import AddressSearch from '@polar/plugin-address-search'
import '@polar/plugin-address-search/styles.css'
import Attributions from '@polar/plugin-attributions'
import '@polar/plugin-attributions/styles.css'
import GeoLocation from '@polar/plugin-geo-location'
import '@polar/plugin-geo-location/styles.css'
import IconMenu from '@polar/plugin-icon-menu'
import '@polar/plugin-icon-menu/styles.css'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import '@polar/plugin-loading-indicator/styles.css'
import Pins from '@polar/plugin-pins'
import '@polar/plugin-pins/styles.css'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
import '@polar/plugin-reverse-geocoder/styles.css'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'

import { MODE } from './enums'
import createMenus from './utils/createMenus'

// this is an acceptable length for list-like functions
// eslint-disable-next-line max-lines-per-function
export const addPlugins = (core, mode: keyof typeof MODE) => {
  const iconMenu = IconMenu({
    initiallyOpen: 'layerChooser',
    displayComponent: true,
    menus: createMenus(mode),
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })

  setLayout(NineLayout)

  core.addPlugins(
    [
      mode !== MODE.SINGLE &&
        AddressSearch({
          displayComponent: true,
          layoutTag: NineLayoutTag.TOP_LEFT,
          addLoading: 'plugin/loadingIndicator/addLoadingKey',
          removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
        }),
      Pins({
        displayComponent: true,
        appearOnClick: { show: true, atZoomLevel: 0 },
        coordinateSource: 'plugin/addressSearch/chosenAddress',
        toastAction: 'plugin/toast/addToast',
      }),
      iconMenu,
      Attributions({
        displayComponent: true,
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        windowWidth: 550,
        listenToChanges: [
          'plugin/zoom/zoomLevel',
          'plugin/layerChooser/activeBackgroundId',
          'plugin/layerChooser/activeMaskIds',
        ],
      }),
      LoadingIndicator({
        displayComponent: true,
        layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      }),
      Scale({ displayComponent: true, layoutTag: NineLayoutTag.BOTTOM_RIGHT }),
      Toast({
        displayComponent: true,
        layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
      }),
      mode !== MODE.SINGLE &&
        GeoLocation({
          displayComponent: false,
          toastAction: 'plugin/toast/addToast',
        }),
      ReverseGeocoder({
        url: 'https://geodienste.hamburg.de/HH_WPS',
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
        zoomTo: 7,
      }),
    ].filter((x) => x /* remove `false` entries */)
  )
}
