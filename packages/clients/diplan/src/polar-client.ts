import polarCore, { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import Gfi from '@polar/plugin-gfi'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'
import merge from 'lodash.merge'

import packageInfo from '../package.json'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore | intentional, file is created precompilation (not versioned)
import iconMap from '../assets/dist/iconMap'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore | intentional, file is created precompilation (not versioned)
import cssVariables from '../assets/dist/cssVariables'

// TODO use when implemented
// import GfiContent from './plugins/Gfi'

import './index.css'

// eslint-disable-next-line no-console
console.log(`DiPlanKarten-POLAR-Client v${packageInfo.version}.`)

setLayout(NineLayout)

polarCore.addPlugins([
  IconMenu({
    displayComponent: true,
    menus: [
      {
        plugin: LayerChooser({}),
        icon: '$vuetify.icons.layer',
        id: 'layerChooser',
      },
      {
        plugin: Draw({}),
        icon: '$vuetify.icons.ruler',
        id: 'draw',
      },
      {
        plugin: Zoom({
          renderType: 'iconMenu',
          // showMobile: true, // TODO enable to check icons, maybe style them
          icons: {
            zoomIn: '$vuetify.icons.plus',
            zoomOut: '$vuetify.icons.minus',
          },
        }),
        id: 'zoom',
      },
    ],
    layoutTag: NineLayoutTag.TOP_RIGHT,
  }),
  AddressSearch({
    displayComponent: false,
    layoutTag: NineLayoutTag.TOP_LEFT,
    addLoading: 'plugin/loadingIndicator/addLoadingKey',
    removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
    // must be overridden by client-specific configuration
    searchMethods: [],
  }),
  Attributions({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    listenToChanges: [
      'plugin/zoom/zoomLevel',
      'plugin/layerChooser/activeBackgroundId',
      'plugin/layerChooser/activeMaskIds',
    ],
    icons: {
      close: '$vuetify.icons.chevron-right',
      open: '$vuetify.icons.info',
    },
  }),
  LoadingIndicator({
    displayComponent: true,
    layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
  }),
  Pins({
    appearOnClick: { show: true, atZoomLevel: 0 },
    coordinateSource: 'plugin/addressSearch/chosenAddress',
  }),
  Gfi({
    displayComponent: true,
    layoutTag: NineLayoutTag.TOP_LEFT,
    coordinateSources: [],
    layers: {},
  }),
  Scale({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_RIGHT,
  }),
  Toast({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
  }),
])

const originalCreateMap = polarCore.createMap

polarCore.createMap = (properties) =>
  originalCreateMap(
    merge(properties, {
      mapConfiguration: {
        vuetify: {
          theme: {
            themes: {
              light: {
                primary: cssVariables.dpsColorDark,
                primaryContrast: cssVariables.dpsColorBackground,
                // secondary not defined; using same as primary
                secondary: cssVariables.dpsColorDark,
                secondaryContrast: cssVariables.dpsColorBackground,
                accent: cssVariables.dpsColorPrimaryTint,
                error: cssVariables.dpsColorError,
                info: cssVariables.dpsColorPrimaryDarker,
                success: cssVariables.dpsColorSuccess,
                warning: cssVariables.dpsColorWarning,
              },
            },
          },
          icons: {
            values: {
              ...iconMap,
            },
          },
        },
      },
    })
  )

export default polarCore
