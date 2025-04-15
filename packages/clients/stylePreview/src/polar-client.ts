import polarCore, { NineLayout, NineLayoutTag, setLayout } from '@polar/core'
import PolarPluginAttributions from '@polar/plugin-attributions'
import PolarPluginLayerChooser from '@polar/plugin-layer-chooser'
import PolarPluginScale from '@polar/plugin-scale'
import PolarPluginZoom from '@polar/plugin-zoom'

import packageInfo from '../package.json'
import { addStylePreview } from './stylePreview'

// eslint-disable-next-line no-console
console.log(`StylePreview-POLAR-Client v${packageInfo.version}.`)

setLayout(NineLayout)

polarCore.addPlugins([
  PolarPluginLayerChooser({
    displayComponent: true,
    layoutTag: NineLayoutTag.TOP_RIGHT,
  }),
  PolarPluginAttributions({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    listenToChanges: [
      'plugin/zoom/zoomLevel',
      'plugin/layerChooser/activeBackgroundId',
      'plugin/layerChooser/activeMaskIds',
    ],
  }),
  PolarPluginScale({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    showScaleSwitcher: true,
    zoomMethod: 'plugin/zoom/setZoomLevel',
  }),
  PolarPluginZoom({
    displayComponent: true,
    layoutTag: NineLayoutTag.MIDDLE_RIGHT,
  }),
])

export default {
  ...polarCore,
  createMap(...args) {
    return polarCore
      .createMap(...args)
      .then((mapInstance) => addStylePreview(mapInstance))
  },
}
