import { PolarActionTree } from '@polar/lib-custom-types'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Interaction } from 'ol/interaction'
import Feature from 'ol/Feature'
import { MeasureGetters, MeasureState, Mode, Unit } from '../types'
import * as createDeleteInteractions from '../utils/createDeleteInteraction'
import createInteractions from '../utils/createInteractions'
import createStyleFunc from '../utils/createStyleFunc'

// NOTE this is acceptable for list-like functions
// eslint-disable-next-line max-lines-per-function
export const makeActions = () => {
  let interactions: Interaction[] = []
  const drawSource = new VectorSource()
  const drawLayer = new VectorLayer({ source: drawSource })

  const actions: PolarActionTree<MeasureState, MeasureGetters> = {
    ...createDeleteInteractions,
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
      // clears existing interactions
      interactions.forEach((interaction) => map.removeInteraction(interaction))
      // adds new interactions
      interactions = await dispatch('createInteractions', drawLayer)
      interactions.forEach((interaction) => {
        map.addInteraction(interaction)
      })
    },
  }
  return actions
}
