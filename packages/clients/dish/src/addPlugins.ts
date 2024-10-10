import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import PolarPluginAddressSearch from '@polar/plugin-address-search'
import PolarPluginAttributions from '@polar/plugin-attributions'
import PolarPluginDraw from '@polar/plugin-draw'
import PolarPluginExport from '@polar/plugin-export'
import PolarPluginFullscreen from '@polar/plugin-fullscreen'
import PolarPluginGeoLocation from '@polar/plugin-geo-location'
import PolarPluginGfi from '@polar/plugin-gfi'
import PolarPluginIconMenu from '@polar/plugin-icon-menu'
import PolarPluginLayerChooser from '@polar/plugin-layer-chooser'
import PolarPluginLegend from '@polar/plugin-legend'
import PolarPluginLoadingIndicator from '@polar/plugin-loading-indicator'
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
import { MODE } from './enums'
import DishGfiIntern from './plugins/internGfi'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

const pluginGfiExtern = {
  coordinateSources: ['plugin/addressSearch/chosenAddress'],
  gfiContentComponent: DishGfiContent,
  afterLoadFunction: extendGfi,
}

const pluginGfiIntern = {
  gfiContentComponent: DishGfiIntern,
}

function getPluginGfiConfig(mode: keyof typeof MODE) {
  return mode === MODE.EXTERN ? pluginGfiExtern : pluginGfiIntern
}

// this is fine for list-like setup functions
// eslint-disable-next-line max-lines-per-function
export const addPlugins = (core, mode: keyof typeof MODE = 'EXTERN') => {
  const internalMenu = [
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
    {
      plugin: PolarPluginFullscreen({ renderType: 'iconMenu' }),
      id: 'fullscreen',
    },
  ]
  const externalMenu = [
    {
      plugin: PolarPluginLayerChooser({}),
      icon: 'fa-layer-group',
      id: 'layerChooser',
    },
  ]
  const iconMenu = PolarPluginIconMenu({
    displayComponent: true,
    menus: mode === MODE.INTERN ? internalMenu : externalMenu,
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })

  setLayout(NineLayout)

  core.addPlugins([
    iconMenu,
    DishModal({
      displayComponent: mode === MODE.EXTERN,
      layoutTag: NineLayoutTag.TOP_LEFT,
    }),
    DishHeader({
      displayComponent: mode === MODE.EXTERN,
      layoutTag: NineLayoutTag.TOP_MIDDLE,
    }),
    PolarPluginAddressSearch(
      merge(
        {},
        {
          displayComponent: mode === MODE.EXTERN,
          layoutTag: NineLayoutTag.TOP_LEFT,
          addLoading: 'plugin/loadingIndicator/addLoadingKey',
          removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
          customSearchMethods: { dish: search, autocomplete },
          customSelectResult: {
            categoryDenkmalsucheAutocomplete: selectResult,
          },
        }
      )
    ),
    PolarPluginExport(
      merge({}, defaultOptions, {
        displayComponent: mode === MODE.INTERN,
        layoutTag: NineLayoutTag.BOTTOM_LEFT,
      })
    ),
    PolarPluginPins({
      displayComponent: mode === MODE.EXTERN,
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
    }),
    PolarPluginLegend(
      merge(
        {},
        {
          displayComponent: mode === MODE.EXTERN,
          layoutTag: NineLayoutTag.BOTTOM_RIGHT,
          maxWidth: 500,
        }
      )
    ),
    PolarPluginAttributions({
      displayComponent: true,
      layoutTag:
        mode === MODE.EXTERN
          ? NineLayoutTag.BOTTOM_RIGHT
          : NineLayoutTag.BOTTOM_MIDDLE,
      listenToChanges: [
        'plugin/zoom/zoomLevel',
        'plugin/layerChooser/activeBackgroundId',
        'plugin/layerChooser/activeMaskIds',
      ],
    }),
    PolarPluginGfi(
      merge(
        {},
        {
          displayComponent: true,
          layoutTag: NineLayoutTag.TOP_LEFT,
        },
        getPluginGfiConfig(mode)
      )
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
      merge(
        {},
        {
          displayComponent: mode === MODE.EXTERN,
          layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
        }
      )
    ),
    PolarPluginZoom(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_RIGHT,
      })
    ),
    PolarPluginGeoLocation(
      merge(
        {},
        {
          displayComponent: mode === MODE.EXTERN,
          layoutTag: NineLayoutTag.MIDDLE_RIGHT,
        }
      )
    ),
  ])
}
