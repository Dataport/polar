import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { Collection } from 'ol'
import BaseLayer from 'ol/layer/Base'
import { PolarModule } from '@polar/lib-custom-types'
import * as lib from '../utils/lib'
import { AttributionsGetters, AttributionsState } from '../types'

const getInitialState = (): AttributionsState => ({
  layer: [],
  attributions: [],
  windowIsOpen: false,
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
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
            {
              deep: true,
            }
          )
        )
        const layer: Collection<BaseLayer> = map.getLayers()
        layer.on('add', () => dispatch('setLayer'))
        layer.on('add', () => dispatch('setAttributions'))
        layer.on('change', () => dispatch('setLayer'))

        dispatch('setLayer')
        dispatch('setAttributions')

        if (
          typeof rootGetters.configuration?.attributions?.initiallyOpen ===
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
      listenToChanges: (_, __, ___, rootGetters) =>
        rootGetters.configuration?.attributions?.listenToChanges || [],
      mapInfo: (_, { layer, attributions, staticAttributions }) => {
        return lib.updateMapInfo(layer, attributions, staticAttributions)
      },
      renderType: (_, __, ___, rootGetters) =>
        rootGetters.configuration?.attributions?.renderType || 'independent',
      staticAttributions: (_, __, ___, rootGetters) => {
        return rootGetters.configuration?.attributions?.staticAttributions || []
      },
      windowWidth: (_, __, ___, rootGetters) =>
        rootGetters.configuration?.attributions?.windowWidth || 500,
    },
  }

  return storeModule
}
