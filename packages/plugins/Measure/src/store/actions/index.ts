import { PolarActionTree } from '@polar/lib-custom-types'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Interaction } from 'ol/interaction'
import Feature from 'ol/Feature'
import {
  MeasureGetters,
  MeasureMode,
  MeasureState,
  Mode,
  Unit,
} from '../../types'
import {
  createDeleteInteraction,
  removeFeature,
} from './createDeleteInteraction'
import createStyleFunc from './createStyleFunc'
import createInteractions from './createInteractions'

export const makeActions = () => {
  let interactions: Interaction[] = []
  const drawSource = new VectorSource()
  const drawLayer = new VectorLayer({ source: drawSource })

  const actions: PolarActionTree<MeasureState, MeasureGetters> = {
    createDeleteInteraction,
    removeFeature,
    createInteractions,
    createStyleFunc,
    // creates the drawing layer for measuring
    setupModule({ dispatch, rootGetters: { map } }) {
      map.addLayer(drawLayer)
      dispatch('updateInteractions')
    },
    setMode({ commit, dispatch }, mode: Mode) {
      commit('setMode', mode)
      dispatch('updateInteractions')
    },
    setMeasureMode({ commit, dispatch }, measureMode: MeasureMode) {
      commit('setMeasureMode', measureMode)
      dispatch('updateInteractions')
    },
    setUnit({ commit, dispatch }, unit: Unit) {
      commit('setUnit', unit)
      dispatch('updateInteractions')
    },
    setSelectedFeature({ commit }, feature: Feature | null) {
      commit('setSelectedFeature', feature)
      commit('setGeometry')
      commit('setSelectedUnit')
      commit('setMeasure')
    },
    clearLayer() {
      drawSource.clear()
    },
    async updateInteractions({ dispatch, rootGetters: { map } }) {
      interactions.forEach((interaction) => map.removeInteraction(interaction))
      interactions = await dispatch('createInteractions', drawLayer)
      interactions.forEach((interaction) => {
        map.addInteraction(interaction)
      })
    },
  }
  return actions
}
