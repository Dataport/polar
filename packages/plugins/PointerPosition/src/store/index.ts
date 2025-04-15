import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { Coordinate, createStringXY } from 'ol/coordinate'
import { transform } from 'ol/proj'
import { PointerPositionGetters, PointerPositionState } from '../types'

const getInitialState = (): PointerPositionState => ({
  selectedProjection: 0,
  pointerPosition: [],
})

// putting this as a module variable to skip map .on/.un hassle
let converter: (coordinate: Coordinate) => Coordinate

export const makeStoreModule = () => {
  const storeModule: PolarModule<PointerPositionState, PointerPositionGetters> =
    {
      namespaced: true,
      state: getInitialState(),
      actions: {
        setupModule({ state, rootGetters: { map }, commit, dispatch }) {
          dispatch('setSelectedProjection', state.selectedProjection)
          map.on('pointermove', (event) =>
            commit('setPointerPosition', converter?.(event.coordinate) || [])
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
              getters.projections[nextSelectedProjection].code
            )
          // one-time conversions on CRS change if previous value exists
          if (getters.pointerPosition.length) {
            commit(
              'setPointerPosition',
              transform(
                getters.pointerPosition,
                getters.projections[getters.selectedProjection].code,
                getters.projections[nextSelectedProjection].code
              )
            )
          }
          commit('setSelectedProjection', nextSelectedProjection)
        },
      },
      getters: {
        ...generateSimpleGetters(getInitialState()),
        configuration(_, __, ___, rootGetters) {
          return rootGetters.configuration?.pointerPosition || {}
        },
        projections(_, getters, ___, rootGetters) {
          if (getters.configuration.projections) {
            return getters.configuration.projections.map((entry) => ({
              ...entry,
              decimals: entry.decimals ?? 4,
            }))
          }
          return rootGetters.configuration.namedProjections.map(([code]) => ({
            code,
            decimals: 4,
          }))
        },
        coordinateString(_, getters) {
          return getters.pointerPosition.length
            ? createStringXY(
                getters.projections[getters.selectedProjection].decimals
              )(getters.pointerPosition)
            : 'X, Y'
        },
      },
      mutations: {
        ...generateSimpleMutations(getInitialState()),
      },
    }

  return storeModule
}
