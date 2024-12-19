import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { LineString, Polygon } from 'ol/geom'
import { MeasureGetters, MeasureState } from '../types'
import { makeActions } from './actions'

const getInitialState = (): MeasureState => ({
  mode: 'select',
  unit: 'm',
  measureMode: 'distance',
  selectedFeature: null,
  selectedUnit: null,
  geometry: null,
  measure: null,
  active: true,
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<MeasureState, MeasureGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    getters: {
      ...generateSimpleGetters(getInitialState()),
      color: (_, __, ___, rootGetters) =>
        rootGetters.configuration?.measure?.color || '#118bee',
      textColor: (_, __, ___, rootGetters) =>
        rootGetters.configuration?.measure?.textColor || '#118bee',
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
      // updates geometry to the geometry of the selected feature
      setGeometry(state) {
        state.geometry = state.selectedFeature
          ? (state.selectedFeature.getGeometry() as LineString | Polygon)
          : null
      },
      // updates measurement to the measurement of the selected feature
      setMeasure(state) {
        state.measure = state.geometry?.get('measure')
          ? state.geometry?.get('measure')
          : null
      },
      // sets unit and fixes the label depending on form
      setSelectedUnit(state) {
        if (state.geometry) {
          state.selectedUnit =
            state.geometry?.getType() === 'Polygon'
              ? state.unit + '²'
              : state.unit
        } else {
          state.selectedUnit = null
        }
      },
    },
  }

  return storeModule
}
