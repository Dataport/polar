import Vue from 'vue'
import { MapConfig } from '@polar/lib-custom-types'
import subscribeFunction from './utils/createMap/subscribe'

export interface MapInstance extends Vue {
  subscribe: typeof subscribeFunction
}

export interface CreateOptions {
  containerId: string
  mapConfiguration: MapConfig
}

export interface ServiceAvailabilityCheck {
  ping: Promise<number>
  service: Record<string, unknown>
}
