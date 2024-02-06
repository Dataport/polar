import Vue from 'vue'
import { FullscreenConfiguration } from '@polar/lib-custom-types'

import { Fullscreen } from './components'
import language from './language'
import { makeStoreModule } from './store'

export default (options: FullscreenConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'fullscreen',
    plugin: Fullscreen,
    language,
    storeModule: makeStoreModule(),
    options,
  })
