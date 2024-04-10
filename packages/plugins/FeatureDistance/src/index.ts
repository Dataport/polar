import Vue from 'vue'
import { FeatureDistance } from './components'
import language from './language'
import { makeStoreModule } from './store'

// NOTE: Currently no options are specified here, variable is kept for integrity until options are needed
export default (options: {}) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'featureDistance',
    plugin: FeatureDistance,
    language,
    storeModule: makeStoreModule(),
    options,
  })