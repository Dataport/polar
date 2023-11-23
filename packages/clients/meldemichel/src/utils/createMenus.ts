import Attributions from '@polar/plugin-attributions'
import Filter from '@polar/plugin-filter'
import Fullscreen from '@polar/plugin-fullscreen'
import LayerChooser from '@polar/plugin-layer-chooser'
import Zoom from '@polar/plugin-zoom'
import { Menu } from '@polar/lib-custom-types'
import { MODE } from '../enums'

export default function (mode: keyof typeof MODE): Menu[] {
  return [
    {
      plugin: LayerChooser({}),
      icon: 'fa-book-atlas',
      id: 'layerChooser',
    },
    mode === MODE.COMPLETE && {
      plugin: Filter({}),
      icon: 'fa-filter',
      id: 'filter',
    },
    {
      plugin: Zoom({ renderType: 'iconMenu' }),
      id: 'zoom',
    },
    mode !== MODE.REPORT && {
      plugin: Fullscreen({ renderType: 'iconMenu' }),
      id: 'fullscreen',
    },
    {
      plugin: Attributions({
        renderType: 'iconMenu',
        windowWidth: 550,
        listenToChanges: [
          'plugin/zoom/zoomLevel',
          'plugin/layerChooser/activeBackgroundId',
          'plugin/layerChooser/activeMaskIds',
        ],
      }),
      icon: 'fa-regular fa-copyright',
      id: 'attributions',
    },
  ].filter((x) => x /* remove `false` entries */) as Menu[]
}
