import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import Header from './Header.vue'
import language from './language'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'header',
    plugin: Header,
    language,
    options,
  })
