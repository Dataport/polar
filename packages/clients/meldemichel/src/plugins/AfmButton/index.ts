import Vue from 'vue'
import { PluginOptions } from '@polar/lib-custom-types'
import AfmButton from './AfmButton.vue'
import language from './language'

export default (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'meldemichelAfmButton',
    plugin: AfmButton,
    language,
    options,
  })
