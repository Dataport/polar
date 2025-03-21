import Vue from 'vue'
import { IconMenuConfiguration } from '@polar/lib-custom-types'
import { IconMenu } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

import IconMenuWrapper from './components/IconMenuWrapper.vue'
export { IconMenuWrapper }

export default (options: IconMenuConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'iconMenu',
    plugin: IconMenu,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
