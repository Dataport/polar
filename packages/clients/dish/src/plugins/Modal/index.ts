import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import Modal from './Modal.vue'
import language from './language'
import storeModule from './store'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'modal',
    plugin: Modal,
    language,
    storeModule,
    options,
  })
