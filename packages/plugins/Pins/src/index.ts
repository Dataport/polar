import { PinsConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import locales from './locales'
import { makeStoreModule } from './store'

export { default as getPointCoordinate } from './util/getPointCoordinate'

export default (options: PinsConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'pins',
    locales,
    storeModule: makeStoreModule(),
    options,
  })
