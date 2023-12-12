/* eslint-disable no-console */
// console is a vital feature for this

import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import merge from 'lodash.merge'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import noop from '@repositoryname/noop'
import i18next from 'i18next'
import {
  CoreState,
  MoveHandleProperties,
  PluginContainer,
  PolarError,
} from '@polar/lib-custom-types'
import { Interaction } from 'ol/interaction'
import { Feature, Map } from 'ol'
import { CapabilitiesModule } from '../storeModules/capabilities'
import { createPanAndZoomInteractions } from '../utils/interactions'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import { useExtendedMasterportalapiMarkers } from './actions/useExtendedMasterportalapiMarkers'
import { getFeaturesCluster } from './actions/useExtendedMasterportalapiMarkers/getFeaturesCluster'

// @ts-expect-error | 'TS2339: Property 'env' does not exist on type 'ImportMeta'.' - It does since we're using vite as a bundler.
const devMode = import.meta.env.DEV

/*
 * NOTE: The following two variables are used to store complex information
 * retrievable from the store without actually adding them to the store.
 * The reason is that complex objects, possibly containing circle references,
 * put a lot of work to the Vuex store to make them reactive, whilst gaining
 * nothing in return. The Vuex store should only be used to store simple information.
 *
 * In a previous case, this led to huge loading times in the Masterportal.
 *
 * To still use the power of Vuex in this regard, this hack is applied.
 * Please note that no child item of map/components is reactive at all.
 * They must be set via setter to let getters toggle through. This is intended.
 */

let map: null | Map = null
let hovered: null | Feature = null
let moveHandle: MoveHandleProperties | null = null
let selected: null | Feature = null
let components = []
let interactions: Interaction[] = []

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
  hovered: 1,
  moveHandle: 1,
  selected: 1,
  zoomLevel: 0,
  // TODO: Add default values for epsg, layers, namedProjections, options and remove @ts-ignore for configuration
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  configuration: {},
  hasSmallDisplay: false,
  errors: [],
  language: '',
})

const setCenter = ({ map }) =>
  store.commit('setCenter', map.getView().getCenter())

const setZoom = ({ map }) =>
  store.commit('setZoomLevel', map.getView().getZoom())

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
    hovered: (state) => {
      noop(state.hovered)
      return hovered
    },
    selected: (state) => {
      noop(state.selected)
      return selected
    },
    // hack: deliver components (outside vuex) based on counter; see NOTE above
    components: (state) => {
      noop(state.components)
      return components
    },
    // TODO: Both will possibly be updated with different breakpoints
    hasSmallHeight: (state) => state.clientHeight <= SMALL_DISPLAY_HEIGHT,
    hasSmallWidth: (state) => state.clientWidth <= SMALL_DISPLAY_WIDTH,
    hasWindowSize(state) {
      return (
        window.innerHeight === state.clientHeight &&
        window.innerWidth === state.clientWidth
      )
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
    setMap: (state, payload) => {
      if (map) {
        map.un('moveend', setCenter)
        map.un('moveend', setZoom)
      }
      map = payload
      if (map) {
        map.on('moveend', setCenter)
        map.on('moveend', setZoom)
        setCenter({ map })
        setZoom({ map })
      }
      // NOTE: hack: don't put map in vuex (complex object); see NOTE above
      state.map = state.map + 1
    },
    setHovered: (state, payload) => {
      if (payload === null || payload.get('features')) {
        hovered = payload
      } else {
        // nested features are invisible and hence unfit for styling
        hovered = getFeaturesCluster(map, payload)
      }
      state.hovered = state.hovered + 1
    },
    setMoveHandle: (state, payload: MoveHandleProperties | null) => {
      moveHandle = payload
      state.moveHandle += 1
    },
    setSelected: (state, payload) => {
      selected = payload
      state.selected = state.selected + 1
    },
    setComponents: (state, payload) => {
      components = payload
      // NOTE: hack: don't put components in vuex (complex objects); see NOTE above
      state.components = state.components + 1
    },
    addError: (state, error: PolarError) => {
      state.errors.push(error)
    },
  },
  actions: {
    addComponent({ state, commit, dispatch }, component: PluginContainer) {
      const { language, name, options, storeModule } = component

      /* configuration merge – "options" are from client-code, "configuration"
       * is from mapConfiguration object and thus overrides */
      commit('setConfiguration', {
        ...state.configuration,
        [name]: merge({}, options, state.configuration[name] || {}),
      })

      // if a store module exists, register it to plugin module namespace
      if (storeModule) {
        this.registerModule(['plugin', name], storeModule)
        const setupActionName = `plugin/${name}/setupModule`
        // @ts-expect-error | It's not defined on the interface but accessible and needed here.
        const setupActionExists = Object.keys(this._actions).includes(
          setupActionName
        )

        if (setupActionExists) {
          dispatch(setupActionName, options)
        }
      }
      if (language) {
        // NOTE: If somehow needed later, add the namespace to the LanguageOption as well
        language.forEach((lng) => {
          i18next.addResourceBundle(lng.type, 'common', lng.resources, true)
        })
      }
      if (state.configuration[name].displayComponent) {
        commit('setComponents', [...components, component])
      }
    },
    updateDragAndZoomInteractions({ getters }) {
      interactions.forEach((i) => getters.map.removeInteraction(i))
      interactions = createPanAndZoomInteractions(
        getters.hasWindowSize,
        window.innerHeight <= SMALL_DISPLAY_HEIGHT ||
          window.innerWidth <= SMALL_DISPLAY_WIDTH
      )
      interactions.forEach((i) => getters.map.addInteraction(i))
    },
    useExtendedMasterportalapiMarkers,
  },
})

i18next.on('languageChanged', (language) => {
  store.commit('setLanguage', language)
})

export default store
