import Vue from 'vue'
import { PinsConfiguration } from '@polar/lib-custom-types'
import storeModule from './store'
import language from './language'

export default (options: PinsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'pins',
    language,
    storeModule,
    options,
  })
