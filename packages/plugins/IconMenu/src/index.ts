import Vue from 'vue'
import { IconMenuConfiguration } from '@polar/lib-custom-types'
import { IconMenu } from './components'
import language from './language'
import storeModule from './store'

export default (options: IconMenuConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'iconMenu',
    plugin: IconMenu,
    language,
    storeModule,
    options,
  })
