import Vue from 'vue'
import type { ReverseGeocoderConfiguration } from '@polar/lib-custom-types'
import { makeStoreModule } from './store'

export default (options: ReverseGeocoderConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'reverseGeocoder',
    storeModule: makeStoreModule(),
    options,
  })
