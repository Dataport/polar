import Vue from 'vue'
import { GeoLocationConfiguration } from '@polar/lib-custom-types'

import { GeoLocation } from './components'
import language from './language'
import storeModule from './store'

export default (options: GeoLocationConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'geoLocation',
    plugin: GeoLocation,
    language,
    storeModule,
    options,
  })
