import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import language from './language'
import DishExportMap from './DishExportMap.vue'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'dishExportMap',
    plugin: DishExportMap,
    language,
    options,
  })
