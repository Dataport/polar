import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import '@polar/core/styles.css'
import PolarPluginAddressSearch from '@polar/plugin-address-search'
import '@polar/plugin-address-search/styles.css'
import PolarPluginAttributions from '@polar/plugin-attributions'
import '@polar/plugin-attributions/styles.css'
import PolarPluginGeoLocation from '@polar/plugin-geo-location'
import '@polar/plugin-geo-location/styles.css'
import PolarPluginGfi from '@polar/plugin-gfi'
import '@polar/plugin-gfi/styles.css'
import PolarPluginIconMenu from '@polar/plugin-icon-menu'
import '@polar/plugin-icon-menu/styles.css'
import PolarPluginLayerChooser from '@polar/plugin-layer-chooser'
import '@polar/plugin-layer-chooser/styles.css'
import PolarPluginLegend from '@polar/plugin-legend'
import '@polar/plugin-legend/styles.css'
import PolarPluginLoadingIndicator from '@polar/plugin-loading-indicator'
import '@polar/plugin-loading-indicator/styles.css'
import PolarPluginPins from '@polar/plugin-pins'
import PolarPluginScale from '@polar/plugin-scale'
import PolarPluginToast from '@polar/plugin-toast'
import PolarPluginZoom from '@polar/plugin-zoom'
import merge from 'lodash.merge'

import { extendGfi } from './utils/extendGfi'
import { search } from './utils/search'
import { autocomplete, selectResult } from './utils/autocomplete'
import DishModal from './plugins/Modal'
import DishHeader from './plugins/Header'
import DishGfiContent from './plugins/Gfi'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

// this is fine for list-like setup functions
// eslint-disable-next-line max-lines-per-function
export const addPlugins = (core) => {
  const iconMenu = PolarPluginIconMenu(
    merge({}, defaultOptions, {
      menus: [
        {
          plugin: PolarPluginLayerChooser({}),
          icon: 'fa-layer-group',
          id: 'layerChooser',
        },
      ],
      layoutTag: NineLayoutTag.TOP_RIGHT,
    })
  )

  setLayout(NineLayout)

  core.addPlugins([
    iconMenu,
    DishModal(defaultOptions),
    DishHeader({
      ...defaultOptions,
      layoutTag: NineLayoutTag.TOP_MIDDLE,
    }),
    PolarPluginAddressSearch(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_LEFT,
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
        customSearchMethods: { dish: search, autocomplete },
        customSelectResult: { categoryDenkmalsucheAutocomplete: selectResult },
      })
    ),
    PolarPluginPins(
      merge({}, defaultOptions, {
        appearOnClick: { show: true, atZoomLevel: 6 },
        coordinateSource: 'plugin/addressSearch/chosenAddress',
      })
    ),
    PolarPluginLegend(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        maxWidth: 500,
      })
    ),
    PolarPluginAttributions(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        listenToChanges: [
          'plugin/zoom/zoomLevel',
          'plugin/layerChooser/activeBackgroundId',
          'plugin/layerChooser/activeMaskIds',
        ],
      })
    ),
    PolarPluginGfi(
      merge({}, defaultOptions, {
        coordinateSources: ['plugin/addressSearch/chosenAddress'],
        gfiContentComponent: DishGfiContent,
        afterLoadFunction: extendGfi,
      })
    ),
    PolarPluginLoadingIndicator(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      })
    ),
    PolarPluginScale(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      })
    ),
    PolarPluginToast(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
      })
    ),
    PolarPluginZoom(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_RIGHT,
      })
    ),
    PolarPluginGeoLocation(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_RIGHT,
      })
    ),
  ])
}
