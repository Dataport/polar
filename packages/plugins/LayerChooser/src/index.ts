import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { LayerChooser } from './components'
import language from './language'
import storeModule from './store'

// NOTE: Currently no options are specified here, variable is kept for integrity until options are needed
export default (options: Partial<PluginOptions>) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'layerChooser',
    plugin: LayerChooser,
    language,
    storeModule,
    options,
  })
