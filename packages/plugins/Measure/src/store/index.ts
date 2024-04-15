import { PolarModule } from '@polar/lib-custom-types'
import { generateSimpleGetters, generateSimpleMutations } from '@repositoryname/vuex-generators'
import { MeasureGetters, MeasureState } from '../types'
import { makeActions } from './actions'

import { LineString, Polygon } from 'ol/geom';
import {getArea, getLength} from "ol/sphere";

const getInitialState = (): MeasureState => ({
  mode: 'select',
  unit: 'm',
  measureMode : 'distance',
  selectedFeature: null,
  selectedUnit: null,
  geometry: null,
  measure: null,
  color: {r: 0, g: 204, b: 204},
  textColor: {r: 0, g: 0, b: 0},
  active: true
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<MeasureState, MeasureGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    getters: {
      ...generateSimpleGetters(getInitialState()),
      selectableModes() {
        return {
          select: 'common:plugins.measure.mode.select',
          draw: 'common:plugins.measure.mode.draw',
          edit: 'common:plugins.measure.mode.edit',
          delete: 'common:plugins.measure.mode.delete',
        }
      },
      selectableMeasureModes() {
        return {
          distance: 'common:plugins.measure.mode.select',
          area: 'common:plugins.measure.mode.draw',
        }
      },
      selectableUnits() {
        return {
          m: 'm / m²',
          km: 'km / km²'
        }
      },
      getRoundedMeasure: ({ unit }, _, __, { map }) => (geometry: LineString | Polygon) => {
        let factor = 1;
        if (unit === 'km') {
          factor = 1000;
        }
        
        const projection = map.getView().getProjection();
        const value = geometry.getType() === 'Polygon' ? 
        getArea(geometry, { projection }) 
        : getLength(geometry, { projection });
        return Math.round((value / factor) * 100) / 100;
      },
    },
    mutations: {...generateSimpleMutations(getInitialState()),
      setGeometry: (state) => {
        state.geometry = state.selectedFeature ? 
        state.selectedFeature.getGeometry() as LineString | Polygon : 
        null;
      },
      setMeasure: (state) => {
        state.measure = state.geometry?.get("measure") ? state.geometry?.get("measure") : null;
      },
      setSelectedUnit: (state) => {
        if (state.geometry) {
          state.selectedUnit = state.geometry?.getType() === 'Polygon' 
          ? state.unit + '²' 
          :  state.unit;
        }
        else {
          state.selectedUnit = null;
        }
      }
    },
  }

  return storeModule
}