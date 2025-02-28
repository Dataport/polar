import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import { GeoEditing } from './components'
import locales from './locales'
// import { makeStoreModule } from './store'

// TODO: Are additional configuration parameters needed?
export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'geoEditing',
    plugin: GeoEditing,
    locales,
    // TODO: Use storeModule when it is merged. Move it from the general diplan-store here.
    // storeModule: makeStoreModule(),
    options,
  })
