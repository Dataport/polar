import Vue from 'vue'
import { ToastConfiguration } from '@polar/lib-custom-types'
import { Toast } from './components'
import locales from './locales'
import { makeStoreModule } from './store'

export default (options: ToastConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'toast',
    plugin: Toast,
    locales,
    options,
    storeModule: makeStoreModule(),
  })
