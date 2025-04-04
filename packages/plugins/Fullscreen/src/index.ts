import Vue from 'vue'
import { FullscreenConfiguration } from '@polar/lib-custom-types'

import { Fullscreen } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: FullscreenConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'fullscreen',
    plugin: Fullscreen,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
