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

// TODO update per epsg from config, default to 4
const formatCoordinate = createStringXY(4)
// TODO should also convert on index change
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
        projectionIndex: number
      ) {
        converter = (coordinate) =>
          transform(
            coordinate,
            map.getView().getProjection().getCode(),
            getters.configuration.projections[projectionIndex]
          )
        commit('setSelectedProjection', projectionIndex)
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
      coordinateString(_, getters) {
        return getters.mousePosition.length
          ? formatCoordinate(getters.mousePosition)
          : 'X, Y'
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
