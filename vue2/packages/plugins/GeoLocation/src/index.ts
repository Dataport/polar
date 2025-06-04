import Vue from 'vue'
import { GeoLocationConfiguration } from '@polar/lib-custom-types'

import { GeoLocation } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: GeoLocationConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'geoLocation',
    plugin: GeoLocation,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
