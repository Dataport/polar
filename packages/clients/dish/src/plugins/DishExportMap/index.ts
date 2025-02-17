import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import locales from './locales'
import DishExportMap from './DishExportMap.vue'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'dishExportMap',
    plugin: DishExportMap,
    locales,
    options,
  })
