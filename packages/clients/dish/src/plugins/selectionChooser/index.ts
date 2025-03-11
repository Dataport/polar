import Vue from 'vue'
import { SelectionChooserOptions } from '../../types'
import SelectionChooser from './SelectionChooser.vue'
import storeModule from './store'
import locales from './locales'

export default (options: SelectionChooserOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'selectionChooser',
    plugin: SelectionChooser,
    storeModule,
    locales,
    options,
  })
