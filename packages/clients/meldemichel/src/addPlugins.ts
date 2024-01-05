import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import GeoLocation from '@polar/plugin-geo-location'
import IconMenu from '@polar/plugin-icon-menu'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
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

  // TODO fix type errors below; always existed, were previously invisible
  //      due to creation of parameter set with lodash.merge

  // TODO plugin availability per mode has to be finalized; below is a draft

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
