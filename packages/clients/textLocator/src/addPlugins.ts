import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import Legend from '@polar/plugin-legend'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'

import Header from './plugins/Header'
import GeometrySearch from './plugins/GeometrySearch'
import {
  searchCoastalGazetteerByToponym,
  selectResult,
} from './utils/coastalGazetteer/searchToponym'
import { idRegister } from './services'

// this is fine for list-like setup functions
// eslint-disable-next-line max-lines-per-function
export const addPlugins = (core) => {
  setLayout(NineLayout)

  core.addPlugins([
    AddressSearch({
      displayComponent: true,
      layoutTag: NineLayoutTag.TOP_LEFT,
      minLength: 3,
      waitMs: 500,
      // @ts-expect-error | URL configured in a different way (simple API)
      searchMethods: [{ type: 'coastalGazetteer' }],
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      customSearchMethods: {
        // @ts-expect-error | Local parameter requirements diverge from type
        coastalGazetteer: searchCoastalGazetteerByToponym,
      },
      customSelectResult: {
        // it's defined like that
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '': selectResult,
      },
    }),
    Draw({
      selectableDrawModes: ['Point', 'Polygon'],
      style: {
        fill: {
          color: 'rgba(255, 255, 255, 0.5)',
        },
        stroke: {
          color: '#e51313',
          width: 2,
        },
        circle: {
          radius: 7,
          fillColor: '#e51313',
        },
      },
    }),
    Header({
      displayComponent: true,
      layoutTag: NineLayoutTag.TOP_LEFT,
    }),
    IconMenu({
      displayComponent: true,
      menus: [
        {
          plugin: GeometrySearch({}),
          icon: 'fa-solid fa-magnifying-glass-location',
          id: 'geometrySearch',
        },
        {
          plugin: LayerChooser({}),
          icon: 'fa-layer-group',
          id: 'layerChooser',
        },
        {
          plugin: Zoom({ renderType: 'iconMenu' }),
          id: 'zoom',
        },
      ],
      layoutTag: NineLayoutTag.TOP_RIGHT,
    }),
    Attributions({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      initiallyOpen: true,
      listenToChanges: [
        'plugin/zoom/zoomLevel',
        'plugin/layerChooser/activeBackgroundId',
        'plugin/layerChooser/activeMaskIds',
      ],
      layerAttributions: idRegister.map((id) => ({
        id,
        title: `textLocator.attributions.${id}`,
      })),
      staticAttributions: ['textLocator.attributions.static'],
    }),
    Legend({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
    LoadingIndicator({
      displayComponent: true,
      layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
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
}
