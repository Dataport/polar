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

// this is fine for list-like setup functions
// eslint-disable-next-line max-lines-per-function
export default (core) => {
  setLayout(NineLayout)

  core.addPlugins([
    IconMenu({
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
          plugin: Gfi({
            renderType: 'iconMenu',
            coordinateSources: ['plugin/addressSearch/chosenAddress'],
            layers: [],
          }),
          icon: 'fa-location-pin',
          id: 'gfi',
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
      layoutTag: NineLayoutTag.TOP_RIGHT,
    }),
    AddressSearch({
      displayComponent: true,
      layoutTag: NineLayoutTag.TOP_LEFT,
    }),
    // TODO remove?
    Pins({
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
    }),
    Legend({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      maxWidth: 500,
    }),
    LoadingIndicator({
      layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
    }),
    Scale({
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
    Toast({
      layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
    }),
  ])
}
