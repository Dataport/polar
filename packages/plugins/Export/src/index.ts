import Vue from 'vue'
import { ExportConfiguration } from '@polar/lib-custom-types'

import { Export } from './components'
import language from './language'
import storeModule from './store'

export { ExportDirection } from './types'
export default (options: ExportConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'export',
    plugin: Export,
    language,
    options,
    storeModule,
  })
