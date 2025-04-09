import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { transform } from 'ol/proj'
import { Coordinate, createStringXY } from 'ol/coordinate.js'
import { mpapiDefaults } from '@polar/core'
import { MousePositionGetters, MousePositionState } from '../types'

const getInitialState = (): MousePositionState => ({
  selectedProjection: 0,
  mousePosition: [],
})

// putting this as a module variable to skip map .on/.un hassle
let converter: (coordinate: Coordinate) => Coordinate

export const makeStoreModule = () => {
  const storeModule: PolarModule<MousePositionState, MousePositionGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ state, rootGetters: { map }, commit, dispatch }) {
        dispatch('setSelectedProjection', state.selectedProjection)
        map.on('pointermove', (event) =>
          commit('setMousePosition', converter?.(event.coordinate) || [])
        )
      },
      setSelectedProjection(
        { rootGetters: { map }, commit, getters },
        nextSelectedProjection: number
      ) {
        converter = (coordinate) =>
          transform(
            coordinate,
            map.getView().getProjection().getCode(),
            getters.projections[nextSelectedProjection]
          )
        // one-time conversions on CRS change if previous value exists
        if (getters.mousePosition.length) {
          commit(
            'setMousePosition',
            transform(
              getters.mousePosition,
              getters.projections[getters.selectedProjection],
              getters.projections[nextSelectedProjection]
            )
          )
        }
        commit('setSelectedProjection', nextSelectedProjection)
      },
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      configuration(_, __, ___, rootGetters) {
        return {
          projections: (
            rootGetters.configuration?.namedProjections ||
            mpapiDefaults.namedProjections
          ).map((definitionArray) => definitionArray[0]),
          ...(rootGetters.configuration?.mousePosition || {}),
        }
      },
      projections(_, getters) {
        return getters.configuration?.projections || []
      },
      decimals(_, getters) {
        return getters.configuration?.decimals || {}
      },
      coordinateString(_, getters) {
        return getters.mousePosition.length
          ? createStringXY(
              getters.decimals[
                getters.projections[getters.selectedProjection]
              ] ?? 4
            )(getters.mousePosition)
          : 'X, Y'
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
