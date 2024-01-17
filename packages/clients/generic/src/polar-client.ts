import core, { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import Export from '@polar/plugin-export'
import Filter from '@polar/plugin-filter'
import Fullscreen from '@polar/plugin-fullscreen'
import GeoLocation from '@polar/plugin-geo-location'
import Gfi from '@polar/plugin-gfi'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import Legend from '@polar/plugin-legend'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'

import packageInfo from '../package.json'
import { MapConfig } from '../../../types/custom'

type PluginName =
  | 'address-search'
  | 'attributions'
  | 'draw'
  | 'export'
  | 'filter'
  | 'fullscreen'
  | 'geo-location'
  | 'gfi'
  | 'icon-menu'
  | 'layer-chooser'
  | 'legend'
  | 'loading-indicator'
  | 'pins'
  | 'reverse-geocoder'
  | 'scale'
  | 'toast'
  | 'zoom'

// eslint-disable-next-line no-console
console.info(`@polar/client-generic: running in v${packageInfo.version}.`)

setLayout(NineLayout)

// this is fine for list-like setup functions
// eslint-disable-next-line max-lines-per-function
const addPlugins = (coreInstance, enabledPlugins: PluginName[]) => {
  const iconMenu =
    enabledPlugins.includes('icon-menu') &&
    IconMenu({
      displayComponent: true,
      menus: [
        enabledPlugins.includes('layer-chooser') && {
          plugin: LayerChooser({}),
          icon: 'fa-layer-group',
          id: 'layerChooser',
        },
        enabledPlugins.includes('draw') && {
          plugin: Draw({}),
          icon: 'fa-pencil',
          id: 'draw',
        },
        enabledPlugins.includes('filter') && {
          plugin: Filter({
            layers: {},
          }),
          icon: 'fa-filter',
          id: 'filter',
        },
        enabledPlugins.includes('gfi') && {
          plugin: Gfi({
            renderType: 'iconMenu',
            coordinateSources: [],
            layers: [],
          }),
          icon: 'fa-location-pin',
          id: 'gfi',
        },
        enabledPlugins.includes('zoom') && {
          plugin: Zoom({ renderType: 'iconMenu' }),
          id: 'zoom',
        },
        enabledPlugins.includes('fullscreen') && {
          plugin: Fullscreen({ renderType: 'iconMenu' }),
          id: 'fullscreen',
        },
        enabledPlugins.includes('geo-location') && {
          plugin: GeoLocation({
            renderType: 'iconMenu',
          }),
          id: 'geoLocation',
        },
        enabledPlugins.includes('attributions') && {
          plugin: Attributions({
            renderType: 'iconMenu',
          }),
          icon: 'fa-regular fa-copyright',
          id: 'attributions',
        },
      ].filter((x) => x) as Menu[],
      layoutTag: NineLayoutTag.TOP_RIGHT,
    })

  coreInstance.addPlugins(
    [
      iconMenu,
      enabledPlugins.includes('address-search') &&
        AddressSearch({
          layoutTag: NineLayoutTag.TOP_LEFT,
        }),
      enabledPlugins.includes('pins') && Pins({}),
      enabledPlugins.includes('legend') &&
        Legend({
          layoutTag: NineLayoutTag.BOTTOM_RIGHT,
          displayComponent: true,
        }),
      enabledPlugins.includes('export') &&
        Export({
          layoutTag: NineLayoutTag.BOTTOM_LEFT,
          displayComponent: true,
        }),
      enabledPlugins.includes('loading-indicator') &&
        LoadingIndicator({
          layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
        }),
      enabledPlugins.includes('reverse-geocoder') && ReverseGeocoder({}),
      enabledPlugins.includes('scale') &&
        Scale({
          layoutTag: NineLayoutTag.BOTTOM_RIGHT,
          displayComponent: true,
        }),
      enabledPlugins.includes('toast') &&
        Toast({
          layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
        }),
    ].filter((x) => x)
  )
}

export default {
  createMap: ({
    containerId,
    services,
    mapConfiguration,
    enabledPlugins = [],
  }: {
    containerId: string
    services: object[]
    mapConfiguration: MapConfig
    enabledPlugins: Array<PluginName>
  }) =>
    new Promise((resolve) => {
      const coreInstance = { ...core }

      addPlugins(coreInstance, enabledPlugins)

      coreInstance.rawLayerList.initializeLayerList(
        services,
        async (layerConf) => {
          const client = await coreInstance.createMap({
            containerId,
            mapConfiguration: {
              ...mapConfiguration,
              layerConf,
            },
          })

          resolve(client)
        }
      )
    }),
}
