import { PluginOptions } from '@polar/lib-custom-types'
import Vue from 'vue'
import DishExportMap from './DishExportMap.vue'
import locales from './locales'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'dishExportMap',
    plugin: DishExportMap,
    locales,
    options,
  })
