import { NineLayout, NineLayoutTag, setLayout } from '@polar/core'
import AddressSearchPlugin from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import Gfi from '@polar/plugin-gfi'
import IconMenuPlugin from '@polar/plugin-icon-menu'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import ZoomPlugin from '@polar/plugin-zoom'

import createMenus from './createMenus'
import { MODE } from './mode'

import { AddressSearch } from './plugins/AddressSearch'
import { AttributionButton } from './plugins/Attributions'
import { IconMenu } from './plugins/IconMenu'
import { Zoom } from './plugins/Zoom'

import GeoEditing from './plugins/GeoEditing'
import LinkButton from './plugins/LinkButton'

// complexity deemed acceptable for this setup function
// eslint-disable-next-line max-lines-per-function
export function addPlugins(core, mode: keyof typeof MODE) {
  setLayout(NineLayout)

  const iconMenu = IconMenuPlugin({
    displayComponent: true,
    menus: createMenus(mode),
    layoutTag: NineLayoutTag.TOP_RIGHT,
    component: mode === MODE.POLAR ? undefined : IconMenu,
  })
  core.addPlugins(
    [
      mode !== MODE.DIPLAN_SMALL &&
        AddressSearchPlugin({
          addLoading: 'plugin/loadingIndicator/addLoadingKey',
          removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
          layoutTag: NineLayoutTag.TOP_LEFT,
          // must be overridden by client-specific configuration
          searchMethods: [],
          component: mode === MODE.POLAR ? undefined : AddressSearch,
        }),
      mode !== MODE.DIPLAN_SMALL && iconMenu,
      mode === MODE.DIPLAN_TWO &&
        GeoEditing({
          displayComponent: true,
          layoutTag: NineLayoutTag.TOP_RIGHT,
        }),
      mode !== MODE.DIPLAN_SMALL &&
        Attributions({
          displayComponent: true,
          layoutTag:
            mode === MODE.POLAR
              ? NineLayoutTag.BOTTOM_RIGHT
              : NineLayoutTag.BOTTOM_LEFT,
          listenToChanges: [
            'plugin/zoom/zoomLevel',
            'plugin/layerChooser/activeBackgroundId',
            'plugin/layerChooser/activeMaskIds',
          ],
          icons: {
            close: `$vuetify.icons.chevron-${
              mode === MODE.POLAR ? 'right' : 'left'
            }`,
            open: '$vuetify.icons.info',
          },
          buttonComponent: mode === MODE.POLAR ? undefined : AttributionButton,
        }),
      ZoomPlugin({
        layoutTag:
          mode === MODE.POLAR
            ? NineLayoutTag.MIDDLE_RIGHT
            : NineLayoutTag.BOTTOM_RIGHT,
        displayComponent: mode !== MODE.DIPLAN_SMALL,
        icons: {
          zoomIn: '$vuetify.icons.plus',
          zoomOut: '$vuetify.icons.minus',
        },
        component: mode === MODE.POLAR ? undefined : Zoom,
      }),
      mode !== MODE.POLAR &&
        LinkButton({
          displayComponent: true,
          layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        }),
      (mode === MODE.DIPLAN_ONE || mode === MODE.DIPLAN_TWO) &&
        Draw({
          displayComponent: false,
          toastAction: 'plugin/toast/addToast',
          addLoading: 'plugin/loadingIndicator/addLoadingKey',
          removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
        }),
      mode !== MODE.DIPLAN_SMALL &&
        LoadingIndicator({
          displayComponent: true,
          layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
        }),
      mode !== MODE.DIPLAN_SMALL &&
        Pins({
          toZoomLevel: 9,
          movable: 'drag',
          appearOnClick: { show: true, atZoomLevel: 0 },
          coordinateSource: 'plugin/addressSearch/chosenAddress',
        }),
      mode !== MODE.DIPLAN_SMALL &&
        Gfi({
          displayComponent: true,
          layoutTag: NineLayoutTag.TOP_LEFT,
          coordinateSources: [],
          layers: {},
        }),
      mode !== MODE.DIPLAN_SMALL &&
        Scale({
          displayComponent: true,
          layoutTag: NineLayoutTag.BOTTOM_RIGHT,
        }),
      mode !== MODE.DIPLAN_SMALL &&
        Toast({
          displayComponent: true,
          layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
        }),
    ].filter((x) => x /* remove `false` entries */)
  )
}
