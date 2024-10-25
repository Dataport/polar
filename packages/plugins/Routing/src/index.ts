import Vue from 'vue'
import { RoutingConfiguration } from '@polar/lib-custom-types'
import { makeStoreModule } from './store'

export default (options: RoutingConfiguration) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'routing',
    storeModule: makeStoreModule(),
    options,
  })
