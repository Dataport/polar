import { ScaleConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { Scale } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export { default as beautifyScale } from './utils/beautifyScale'
export { default as thousandsSeparator } from './utils/thousandsSeperator'
export { default as getDpi } from './utils/getDpi'

export default (options: ScaleConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'scale',
    plugin: Scale,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
