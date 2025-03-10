import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import SelectionChooser from './SelectionChooser.vue'
import storeModule from './store'
import locales from './locales'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'selectionChooser',
    plugin: SelectionChooser,
    storeModule,
    locales,
    options,
  })
