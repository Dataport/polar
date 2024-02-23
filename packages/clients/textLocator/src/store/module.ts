// some names are defined by the environment
/* eslint-disable camelcase */

import { PolarModule } from '@polar/lib-custom-types'

// TODO remove
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextLocatorGetters {}

/* TextLocator VueX Store Module for system-specific contents. */
export const textLocatorModule: PolarModule<
  Record<string, never>,
  TextLocatorGetters
> = {
  namespaced: true,
  state: {},
  actions: {},
  mutations: {},
  getters: {},
}
