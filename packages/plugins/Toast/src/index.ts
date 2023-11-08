import Vue from 'vue'
import { ToastConfiguration } from '@polar/lib-custom-types'
import { Toast } from './components'
import language from './language'
import storeModule from './store'

export default (options: ToastConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'toast',
    plugin: Toast,
    language,
    options,
    storeModule,
  })
