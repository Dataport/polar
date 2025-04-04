import { Menu } from '@polar/lib-custom-types'
import Draw from '@polar/plugin-draw'
import LayerChooserPlugin from '@polar/plugin-layer-chooser'
import GeoEditing from './plugins/GeoEditing'
import { LayerChooser } from './plugins/LayerChooser'
import { MODE } from './mode'

export default function (mode: keyof typeof MODE): Menu[] {
  return [
    mode !== MODE.DIPLAN_SMALL && {
      plugin: LayerChooserPlugin({
        component: mode === MODE.POLAR ? undefined : LayerChooser,
      }),
      icon: '$vuetify.icons.layer-half',
      id: 'layerChooser',
    },
    mode === MODE.POLAR && {
      plugin: Draw({}),
      icon: '$vuetify.icons.create',
      id: 'draw',
    },
    mode === MODE.DIPLAN_ONE && {
      plugin: GeoEditing({}),
      icon: '$vuetify.icons.placeholder',
      id: 'geoEditing',
    },
  ].filter((x) => x /* remove `false` entries */) as Menu[]
}
