import Vue from 'vue'
import { PinsConfiguration } from '@polar/lib-custom-types'
import { makeStoreModule } from './store'
import locales from './locales'

export { default as getPointCoordinate } from './util/getPointCoordinate'

export default (options: PinsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'pins',
    locales,
    storeModule: makeStoreModule(),
    options,
  })
