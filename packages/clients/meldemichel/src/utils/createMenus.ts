import Attributions from '@polar/plugin-attributions'
import Fullscreen from '@polar/plugin-fullscreen'
import Gfi from '@polar/plugin-gfi'
import LayerChooser from '@polar/plugin-layer-chooser'
import Zoom from '@polar/plugin-zoom'
import { Menu } from '@polar/lib-custom-types'
import { MODE } from '../enums'
import MeldemichelGfiFeature from '../plugins/Gfi'

export default function (mode: keyof typeof MODE): Menu[] {
  return [
    {
      plugin: LayerChooser({}),
      icon: 'fa-book-atlas',
      id: 'layerChooser',
    },
    {
      plugin: Gfi({
        displayComponent: true,
        gfiContentComponent: MeldemichelGfiFeature,
        coordinateSources: [
          'plugin/pins/transformedCoordinate',
          'plugin/pins/coordinatesAfterDrag',
        ],
        showGfi: true,
        featureList: {
          mode: 'visible',
          pageLength: 10,
        },
      }),
      icon: 'fa-location-pin',
      id: 'gfi',
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
