import { PluginOptions } from '@polar/lib-custom-types'
import Vue from 'vue'
import Modal from './Modal.vue'
import locales from './locales'
import storeModule from './store'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'modal',
    plugin: Modal,
    locales,
    storeModule,
    options,
  })
