// console is a vital feature for this
/* eslint-disable no-console */
import {
  CoreState,
  MapConfig,
  MoveHandleActionButton,
  MoveHandleProperties,
  PluginContainer,
  PolarError,
} from '@polar/lib-custom-types'
import getCluster from '@polar/lib-get-cluster'
import noop from '@repositoryname/noop'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import i18next from 'i18next'
import merge from 'lodash.merge'
import { Feature, Map } from 'ol'
import { easeOut } from 'ol/easing'
import { Point } from 'ol/geom'
import { Interaction } from 'ol/interaction'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { CapabilitiesModule } from '../storeModules/capabilities'
import { SMALL_DISPLAY_HEIGHT, SMALL_DISPLAY_WIDTH } from '../utils/constants'
import { createPanAndZoomInteractions } from '../utils/interactions'
import { addInterceptor } from './actions/addInterceptor'
import checkServiceAvailability from './actions/checkServiceAvailability'
import {
  updateSelection,
  useExtendedMasterportalapiMarkers,
} from './actions/useExtendedMasterportalapiMarkers'

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
  hovered: 1,
  moveHandle: 1,
  moveHandleActionButton: 1,
  selected: 1,
  zoomLevel: 0,
  // @ts-expect-error | Required values are set in utils/createMap/index.ts
  configuration: {
    layers: [],
    layerConf: [],
    startCenter: [0, 0],
  },
  hasSmallDisplay: false,
  errors: [],
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
  let hovered: null | Feature = null
  let moveHandle: MoveHandleProperties | null = null
  let moveHandleActionButton: MoveHandleActionButton | null = null
  let selected: null | Feature = null
  let components: PluginContainer[] = []
  let interactions: Interaction[] = []

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
      moveHandleActionButton: (state) => {
        noop(state.moveHandleActionButton)
        return moveHandleActionButton
      },
      hovered: (state) => {
        noop(state.hovered)
        return hovered
      },
      selected: (state) => {
        noop(state.selected)
        return selected
      },
      selectedCoordinates: (state) => {
        noop(state.selected)
        return selected === null
          ? null
          : (selected.getGeometry() as Point).getCoordinates()
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
      deviceIsHorizontal: (_, getters) =>
        getters.hasSmallHeight && getters.hasWindowSize,
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
        } else if (map !== null) {
          // nested features are invisible and hence unfit for styling
          hovered = getCluster(map, payload, '_gfiLayerId')
        }
        state.hovered = state.hovered + 1
      },
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
      addInterceptor,
      checkServiceAvailability,
      addComponent({ state, commit, dispatch }, component: PluginContainer) {
        const { locales, language, name, options, storeModule } = component

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
        if (locales ?? language) {
          // NOTE: If somehow needed later, add the namespace to the Locale as well
          ;(locales ?? language).forEach((lng) => {
            i18next.addResourceBundle(lng.type, 'common', lng.resources, true)
          })
        }
        if (state.configuration[name].displayComponent) {
          commit('setComponents', [...components, component])

          if (!state.configuration[name].layoutTag) {
            console.warn(
              `@polar/core: Component "${name}" was registered as visible ('displayComponent' had a truthy value), but no 'layoutTag' was associated. This may be an error in configuration and will lead to the component not being visible in the UI.`
            )
          }
        }
      },
      centerOnFeature({ rootGetters: { map } }, feature: Feature) {
        map.getView().animate({
          center: (feature.getGeometry() as Point).getCoordinates(),
          duration: 400,
          easing: easeOut,
        })
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
      updateSelection,
    },
  })
  i18next.on('languageChanged', (language) => {
    store.commit('setLanguage', language)
  })

  store.commit('setConfiguration', mapConfiguration)
  if (mapConfiguration.oidcToken) {
    // copied to a separate spot for usage as it's changable data at run-time
    store.commit('setOidcToken', mapConfiguration.oidcToken)
  }
  if (mapConfiguration.secureServiceUrlRegex) {
    store.dispatch('addInterceptor', mapConfiguration.secureServiceUrlRegex)
  }

  return store
}
