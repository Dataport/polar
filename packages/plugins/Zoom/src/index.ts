import { ZoomConfiguration } from '@polar/lib-custom-types'
import Vue from 'vue'
import { Zoom } from './components'
import ZoomButtonContainer from './components/ZoomButtonContainer.vue'
import locales from './locales'
import { makeStoreModule } from './store'

export { ZoomButtonContainer }

export default (options: ZoomConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'zoom',
    plugin: Zoom,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
