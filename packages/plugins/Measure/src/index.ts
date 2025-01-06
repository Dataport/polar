import Vue from 'vue'
import { MeasureConfiguration } from '@polar/lib-custom-types'
import { Measure } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: MeasureConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'measure',
    plugin: Measure,
    language,
    storeModule: makeStoreModule(),
    options,
  })
