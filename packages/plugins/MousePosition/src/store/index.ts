import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { createStringXY } from 'ol/coordinate.js'
import { transform } from 'ol/proj'
import { MousePositionGetters, MousePositionState } from '../types'

const getInitialState = (): MousePositionState => ({
  projections: [],
  selectedProjection: '',
  mousePosition: [],
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<MousePositionState, MousePositionGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ rootGetters: { configuration, map }, commit }) {
        const projectionsFromMapConfig = configuration.namedProjections.map(
          (x) => x[0]
        )
        commit('setProjections', projectionsFromMapConfig)
        const formatCoordinate = createStringXY(4)
        map.on('pointermove', function (event) {
          const formattedCoordinate = formatCoordinate(event.coordinate)
          commit('setMousePosition', formattedCoordinate)
        })
        commit('setSelectedProjection', configuration.epsg)
      },
      selectProjection(
        { rootGetters: { map }, commit, getters },
        newProjection
      ) {
        const formatCoordinate = createStringXY(4)
        map.on('pointermove', function (event) {
          const almostNewCoordinate = event.coordinate
          const newCoordinate = transform(
            almostNewCoordinate,
            getters.selectedProjection,
            newProjection
          )
          const formattedCoordinate = formatCoordinate(newCoordinate)
          commit('setMousePosition', formattedCoordinate)
        })
        commit('setSelectedProjection', newProjection)

        /* const extend = map.getView().calculateExtent()
        const extendNewProj = transformExtent(
          extend,
          getters.selectedProjection,
          newProjection
        )
      }, */
      },
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
