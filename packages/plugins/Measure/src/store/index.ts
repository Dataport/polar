import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { LineString, Polygon } from 'ol/geom'
import { getArea, getLength } from 'ol/sphere'
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
  color: { r: 0, g: 204, b: 204 },
  textColor: { r: 0, g: 0, b: 0 },
  active: true,
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<MeasureState, MeasureGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    getters: {
      ...generateSimpleGetters(getInitialState()),
      // label for the modus-selector
      selectableModes() {
        return {
          select: 'common:plugins.measure.mode.select',
          draw: 'common:plugins.measure.mode.draw',
          edit: 'common:plugins.measure.mode.edit',
          delete: 'common:plugins.measure.mode.delete',
        }
      },
      // label for the unit-selector
      selectableUnits() {
        return {
          m: 'm / m²',
          km: 'km / km²',
        }
      },
      // calculates the measurement of the given geometry fixed to two decimal places
      getRoundedMeasure({ unit }, _, __, { map }) {
        return (geometry: LineString | Polygon) => {
          let factor = 1
          if (unit === 'km') {
            factor = 1000
          }

          const projection = map.getView().getProjection()
          const value =
            geometry.getType() === 'Polygon'
              ? getArea(geometry, { projection })
              : getLength(geometry, { projection })
          return Math.round((value / factor) * 100) / 100
        }
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
      // updates geometry to the geometry of the selected feature
      setGeometry: (state) => {
        state.geometry = state.selectedFeature
          ? (state.selectedFeature.getGeometry() as LineString | Polygon)
          : null
      },
      // updates measurement to the measurement of the selected feature
      setMeasure: (state) => {
        state.measure = state.geometry?.get('measure')
          ? state.geometry?.get('measure')
          : null
      },
      // sets unit and fixes the label depending on form
      setSelectedUnit: (state) => {
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
