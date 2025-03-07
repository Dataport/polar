import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { LayerChooser } from './components'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'diplanLayerChooser',
    plugin: LayerChooser,
    // locales,
    options,
  })
