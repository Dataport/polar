import Filter from '@polar/plugin-filter'
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
      icon: 'fa-layer-group',
      id: 'layerChooser',
    },
    mode === MODE.COMPLETE && {
      plugin: Filter({
        layers: {},
      }),
      icon: 'fa-filter',
      id: 'filter',
    },
    mode === MODE.COMPLETE && {
      plugin: Gfi({
        layers: {},
        gfiContentComponent: MeldemichelGfiFeature,
        renderType: 'iconMenu',
        coordinateSources: [
          'plugin/pins/transformedCoordinate',
          'plugin/pins/coordinatesAfterDrag',
        ],
        featureList: {
          mode: 'visible',
          pageLength: 10,
          text: [
            (feature) => `${feature.get('str')} ${feature.get('hsnr')}`,
            (feature) => `meldemichel.skat.${feature.get('skat')}`,
            'beschr',
          ],
          bindWithCoreHoverSelect: true,
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
  ].filter((x) => x /* remove `false` entries */) as Menu[]
}
