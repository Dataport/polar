import { IconMenuConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { IconMenu } from './components'
import IconMenuButton from './components/IconMenuButton.vue'
import locales from './locales'
import { makeStoreModule } from './store'

export { IconMenuButton }

export default (options: IconMenuConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'iconMenu',
    plugin: IconMenu,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
