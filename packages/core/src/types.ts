import Vue from 'vue'
import { MapConfig } from '@polar/lib-custom-types'
import subscribeFunction from './utils/subscribe'

export interface MapInstance extends Vue {
  subscribe: typeof subscribeFunction
}

export interface CreateOptions {
  containerId: string
  mapConfiguration: MapConfig
}
