// console is a vital feature for this
/* eslint-disable no-console */
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import noop from '@repositoryname/noop'
import {
  CoreState,
  MapConfig,
  MoveHandleActionButton,
  MoveHandleProperties,
  PluginContainer,
} from '@polar/lib-custom-types'
import { Map } from 'ol'
import { CapabilitiesModule } from '../storeModules/capabilities'

// @ts-expect-error | 'TS2339: Property 'env' does not exist on type 'ImportMeta'.' - It does since we're using vite as a bundler.
const devMode = import.meta.env.DEV

const mutationLogger = (store) => {
  if (devMode) {
    console.log('DEV MODE DETECTED - VUEX LOGGING ENABLED')
    store.subscribe(({ type, payload }) => {
      let fixedPayload
      // "fix" in the sense of "screenshot" – print doesn't change anymore
      if (typeof payload === 'undefined') {
        fixedPayload = undefined
      } else {
        try {
          fixedPayload = JSON.parse(JSON.stringify(payload))
        } catch (e) {
          // e.g. cyclic objects can't be fixed
          fixedPayload = payload
        }
      }
      console.log(`Mutation: '${type}'; Payload:`, fixedPayload)
    })
  }
}

Vue.use(Vuex)

const getInitialState = (): CoreState => ({
  map: 1,
  clientHeight: 0,
  clientWidth: 0,
  components: 1,
  center: null,
  moveHandle: 1,
  moveHandleActionButton: 1,
  zoomLevel: 0,
  // @ts-expect-error | Required values are set in utils/createMap/index.ts
  configuration: {
    layers: [],
    layerConf: [],
    startCenter: [0, 0],
  },
  hasSmallDisplay: false,
  language: '',
  mapHasDimensions: false,
  oidcToken: '',
})

export const makeStore = (mapConfiguration: MapConfig) => {
  /*
   * NOTE: The following variables are used to store complex information
   * retrievable from the store without actually adding them to the store.
   * The reason is that complex objects, possibly containing circle references,
   * put a lot of work to the Vuex store to make them reactive, whilst gaining
   * nothing in return. The Vuex store should only be used to store simple
   * information.
   *
   * To still use the power of Vuex in this regard, this hack is applied.
   * Please note that no child item of map/components is reactive at all.
   * They must be set via setter to let getters toggle through.
   * This is intended.
   */
  let map: null | Map = null
  let moveHandle: MoveHandleProperties | null = null
  let moveHandleActionButton: MoveHandleActionButton | null = null
  let components: PluginContainer[] = []

  const store = new Store({
    state: getInitialState(),
    plugins: [mutationLogger], // vuex plugins, not polar plugins
    modules: {
      capabilities: CapabilitiesModule,
      /* reserved for plugins */
      plugin: {
        namespaced: true,
      },
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      // hack: deliver map (outside vuex) based on counter; see NOTE above
      map: (state) => {
        noop(state.map)
        return map
      },
      moveHandle: (state) => {
        noop(state.moveHandle)
        return moveHandle
      },
      moveHandleActionButton: (state) => {
        noop(state.moveHandleActionButton)
        return moveHandleActionButton
      },
      // hack: deliver components (outside vuex) based on counter; see NOTE above
      components: (state) => {
        noop(state.components)
        return components
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
      setMoveHandle: (state, payload: MoveHandleProperties | null) => {
        moveHandle = payload
        state.moveHandle += 1
      },
      setMoveHandleActionButton: (
        state,
        payload: MoveHandleActionButton | null
      ) => {
        moveHandleActionButton = payload
        state.moveHandleActionButton += 1
      },
    },
  })

  return store
}
