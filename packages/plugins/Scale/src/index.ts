import Vue from 'vue'
import { ScaleConfiguration } from '@polar/lib-custom-types'
import { Scale } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: ScaleConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'scale',
    plugin: Scale,
    language,
    storeModule: makeStoreModule(),
    options,
  })
