import Vue from 'vue'
import { SelectionObjectOptions } from '../../types'
import SelectionObject from './SelectionObject.vue'
import locales from './locales'
import storeModule from './store'

export default (options: SelectionObjectOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'selectionObject',
    plugin: SelectionObject,
    storeModule,
    locales,
    options,
  })
