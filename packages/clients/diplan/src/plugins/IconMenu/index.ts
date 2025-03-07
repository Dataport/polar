import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { IconMenu } from './components'

// TODO: Are additional configuration parameters needed?
export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'diplanIconMenu',
    plugin: IconMenu,
    options,
  })
