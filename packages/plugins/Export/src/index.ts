import { ExportConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'

import { Export } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export { ExportDirection } from './types'
export default (options: ExportConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'export',
    plugin: Export,
    locales,
    options,
    storeModule: makeStoreModule(),
  })
