import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { GeoEditing } from './components'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'geoEditing',
    plugin: GeoEditing,
    options,
  })
