import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Filter from '@polar/plugin-filter'
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
import merge from 'lodash.merge'

const defaultOptions = {
    displayComponent: true,
    layoutTag: NineLayoutTag.TOP_LEFT,
  }

export default (core) => {
  setLayout(NineLayout)


const iconMenu =  IconMenu({
    displayComponent: true,
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
        plugin: Zoom({ renderType: 'iconMenu' }),
        id: 'zoom',
      },
      {
        plugin: Fullscreen({ renderType: 'iconMenu' }),
        id: 'fullscreen',
      },
      {
        plugin: GeoLocation({
          renderType: 'iconMenu',
        }),
        id: 'geoLocation',
      },
      {
        plugin: Attributions({
          renderType: 'iconMenu',
        }),
        icon: 'fa-regular fa-copyright',
        id: 'attributions',
      }
    ],
})

core.addPlugins([
    iconMenu,
    AddressSearch(
      merge({}, defaultOptions, {
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      })
    ),
    Gfi(
        merge({}, defaultOptions,
      {
        layoutTag: NineLayoutTag.BOTTOM_LEFT,
        renderType: 'iconMenu',
        coordinateSources: ['plugin/addressSearch/chosenAddress'],
      })
    ),
    Pins({
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
    }),
    Legend(
      merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      maxWidth: 500,
      })
    ),
    LoadingIndicator(
      merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      }),
    ),
    Scale(
      merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    })
    ),
    Toast(
      merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
    }),
    ),
  ])
}
