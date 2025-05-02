import Vue from 'vue'
import { ScaleConfiguration } from '@polar/lib-custom-types'
import { Scale } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export { default as beautifyScale } from './utils/beautifyScale'
export { default as thousandsSeparator } from './utils/thousandsSeperator'
export { default as getDpi } from './utils/getDpi'
export { default as calculateScaleFromResolution } from './utils/calculateScaleFromResolution'

export default (options: ScaleConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'scale',
    plugin: Scale,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
