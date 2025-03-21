import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import EditorMenu from './EditorMenu.vue'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'diplanEditor',
    plugin: EditorMenu,
    options,
  })
