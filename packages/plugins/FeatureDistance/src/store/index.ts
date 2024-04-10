import { PolarModule } from '@polar/lib-custom-types'
import { generateSimpleGetters, generateSimpleMutations } from '@repositoryname/vuex-generators'
import { FeatureDistanceGetters, FeatureDistanceState } from '../types'
import { makeActions } from './actions'

import { LineString } from 'ol/geom';
import { getLength } from 'ol/sphere';

const getInitialState = (): FeatureDistanceState => ({
  mode: 'select',
  unit: 'm',
  lineFeature: null,
  line: null,
  length: null,
  color: {r: 0, g: 204, b: 204},
  textColor: {r: 0, g: 0, b: 0},
  active: true
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<FeatureDistanceState, FeatureDistanceGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: makeActions(),
    getters: {
      ...generateSimpleGetters(getInitialState()),
      selectableModes() {
        return {
          select: 'common:plugins.featureDistance.mode.select',
          draw: 'common:plugins.featureDistance.mode.draw',
          edit: 'common:plugins.featureDistance.mode.edit',
          delete: 'common:plugins.featureDistance.mode.delete',
        }
      },
      selectableUnits() {
        return {
          m: 'm',
          km: 'km'
        }
      },
      getRoundedLength: ({ unit }) => (geometry: LineString) => {
        let factor = 1;
        if (unit === 'km') {
          factor = 1000;
        }
        return Math.round((getLength(geometry) / factor) * 100) / 100;
      },
    },
    mutations: {...generateSimpleMutations(getInitialState()),
      setLine: (state) => {
        state.line = state.lineFeature ? state.lineFeature.getGeometry() as LineString : null;
      },
      setLength: (state) => {
        state.length = state.line?.get("length") ? state.line?.get("length") : null;
      },
    },
  }

  return storeModule
}