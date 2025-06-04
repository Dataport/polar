import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Filter from '@polar/plugin-filter'
import Fullscreen from '@polar/plugin-fullscreen'
import Gfi from '@polar/plugin-gfi'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import Legend from '@polar/plugin-legend'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'
import merge from 'lodash.merge'
import BgwGfiContent from './plugins/Gfi/Content.vue'
import {
  badestellenSearch,
  badestellenSearchResult,
} from './utils/badestellenSearch'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

export default (core) => {
  setLayout(NineLayout)

  const iconMenu = IconMenu({
    menus: [
      {
        plugin: LayerChooser({}),
        icon: 'fa-layer-group',
        id: 'layerChooser',
      },
      {
        plugin: Filter({
          layers: {},
        }),
        icon: 'fa-filter',
        id: 'filter',
      },
      {
        plugin: Gfi({
          layers: {},
          renderType: 'iconMenu',
          gfiContentComponent: BgwGfiContent,
          activeLayerPath: 'plugin/layerChooser/activeMaskIds',
          coordinateSources: ['plugin/addressSearch/chosenAddress'],
        }),
        icon: 'fa-location-pin',
        id: 'gfi',
      },
      {
        plugin: Zoom({
          renderType: 'iconMenu',
        }),
        id: 'zoom',
      },
      {
        plugin: Fullscreen({ renderType: 'iconMenu' }),
        id: 'fullscreen',
      },
      {
        plugin: Attributions({ renderType: 'iconMenu' }),
        icon: 'fa-regular fa-copyright',
        id: 'attributions',
      },
    ],
    displayComponent: true,
    initiallyOpen: 'layerChooser',
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })

  core.addPlugins([
    iconMenu,
    AddressSearch(
      merge({}, defaultOptions, {
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
        customSearchMethods: { badestellenSearch },
        customSelectResult: { badestellen: badestellenSearchResult },
      })
    ),
    Pins({
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
    }),
    Legend(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      })
    ),
    LoadingIndicator(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      })
    ),
    Toast(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
      })
    ),
    Scale(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        showScaleSwitcher: true,
        zoomMethod: 'plugin/zoom/setZoomLevel',
      })
    ),
  ])
}
