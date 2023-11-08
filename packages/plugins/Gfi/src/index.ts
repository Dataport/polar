import Vue from 'vue'
import { GfiConfiguration } from '@polar/lib-custom-types'
import { Gfi } from './components'
import language from './language'
import storeModule from './store'

export default (options: GfiConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'gfi',
    plugin: Gfi,
    language,
    storeModule,
    options,
  })
