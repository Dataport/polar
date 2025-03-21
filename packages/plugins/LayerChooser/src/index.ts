import Vue from 'vue'
import { LayerChooserConfiguration } from '@polar/lib-custom-types'
import { LayerChooser } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

import LayerChooserLayerWrapper from './components/LayerWrapper.vue'
import LayerChooserOptions from './components/Options.vue'
export { LayerChooserLayerWrapper, LayerChooserOptions }

export default (options: LayerChooserConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'layerChooser',
    plugin: LayerChooser,
    locales,
    storeModule: makeStoreModule(),
    options,
  })
