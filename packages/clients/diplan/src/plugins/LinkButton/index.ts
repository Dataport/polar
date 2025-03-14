import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import LinkButton from './LinkButton.vue'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'linkButton',
    plugin: LinkButton,
    options,
  })
