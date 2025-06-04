import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import * as lib from '../utils/lib'
import { AttributionsGetters, AttributionsState } from '../types'
import AttributionButton from '../components/AttributionButton.vue'

const getInitialState = (): AttributionsState => ({
  layer: [],
  attributions: [],
  windowIsOpen: false,
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<AttributionsState, AttributionsGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({
        commit,
        dispatch,
        getters: { listenToChanges, renderType },
        rootGetters,
      }): void {
        const { map } = rootGetters
        listenToChanges.forEach((listenPath) =>
          this.watch(
            () => rootGetters[listenPath],
            () => dispatch('setLayer'),
            { deep: true }
          )
        )
        const layer = map.getLayers()
        layer.on('add', () => dispatch('setLayer'))
        layer.on('add', () => dispatch('setAttributions'))
        layer.on('change', () => dispatch('setLayer'))
        map.on('moveend', () => dispatch('setLayer'))

        dispatch('setLayer')
        dispatch('setAttributions')

        if (
          typeof rootGetters.configuration.attributions?.initiallyOpen ===
            'boolean' &&
          renderType === 'independent'
        ) {
          commit(
            'setWindowIsOpen',
            rootGetters.configuration.attributions.initiallyOpen
          )
        }
      },
      setLayer({ rootGetters: { map }, commit }) {
        commit('setLayer', lib.getVisibleLayers(map.getLayers()))
      },
      setAttributions({ rootGetters: { configuration }, commit }) {
        commit(
          'setAttributions',
          configuration.attributions?.layerAttributions === undefined
            ? []
            : configuration.attributions.layerAttributions.map((a) => ({
                ...a,
                title: lib.formatAttributionText(a.title),
              }))
        )
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      buttonComponent: (_, getters) =>
        getters.configuration.buttonComponent || AttributionButton,
      configuration: (_, __, ___, rootGetters) =>
        rootGetters.configuration.attributions || {},
      listenToChanges: (_, getters) =>
        getters.configuration.listenToChanges || [],
      mapInfo: (_, { layer, attributions, staticAttributions }) =>
        lib.updateMapInfo(layer, attributions, staticAttributions),
      mapInfoIcon: (_, getters) => {
        const { icons } = getters.configuration
        return getters.windowIsOpen
          ? icons?.close ?? 'fa-chevron-right'
          : icons?.open ?? 'fa-regular fa-copyright'
      },
      renderType: (_, getters) =>
        getters.configuration.renderType || 'independent',
      staticAttributions: (_, getters) =>
        getters.configuration.staticAttributions || [],
      windowWidth: (_, getters) => getters.configuration.windowWidth || 500,
    },
  }

  return storeModule
}
