import Vue from 'vue'
import { AttributionsConfiguration } from '@polar/lib-custom-types'
import locales from '@polar/plugin-attributions/src/locales'
import { makeStoreModule } from '@polar/plugin-attributions/src/store'
import DishAttributions from './DishAttributions.vue'

export default (options: AttributionsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'attributions',
    plugin: DishAttributions,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
