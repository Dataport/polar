import polarCore, { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import '@polar/core/styles.css'
import PolarPluginAddressSearch from '@polar/plugin-address-search'
import PolarPluginAttributions from '@polar/plugin-attributions'
import PolarPluginDraw from '@polar/plugin-draw'
import PolarPluginExport from '@polar/plugin-export'
import PolarPluginGfi from '@polar/plugin-gfi'
import '@polar/plugin-gfi/styles.css'
import PolarPluginIconMenu from '@polar/plugin-icon-menu'
import PolarPluginLayerChooser from '@polar/plugin-layer-chooser'
import PolarPluginLegend from '@polar/plugin-legend'
import PolarPluginLoadingIndicator from '@polar/plugin-loading-indicator'
import PolarPluginPins from '@polar/plugin-pins'
import PolarPluginScale from '@polar/plugin-scale'
import PolarPluginToast from '@polar/plugin-toast'
import PolarPluginZoom from '@polar/plugin-zoom'
import merge from 'lodash.merge'

import packageInfo from '../package.json'

// eslint-disable-next-line no-console
console.log(`AfM-POLAR-Client v${packageInfo.version}.`)

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

const iconMenu = PolarPluginIconMenu(
  merge({}, defaultOptions, {
    menus: [
      {
        plugin: PolarPluginLayerChooser({}),
        icon: 'fa-layer-group',
        id: 'layerChooser',
      },
      {
        plugin: PolarPluginDraw({}),
        icon: 'fa-pencil',
        id: 'draw',
      },
    ],
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })
)

setLayout(NineLayout)

polarCore.addPlugins([
  iconMenu,
  PolarPluginAddressSearch(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.TOP_LEFT,
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
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
  PolarPluginExport(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_LEFT,
    })
  ),
  PolarPluginGfi(
    merge({}, defaultOptions, {
      coordinateSources: ['plugin/addressSearch/chosenAddress'],
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
])

export default polarCore
