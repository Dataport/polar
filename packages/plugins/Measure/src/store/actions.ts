import { PolarActionTree } from '@polar/lib-custom-types'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import { Interaction } from 'ol/interaction'
import Feature from 'ol/Feature'
import { MeasureGetters, MeasureState, Mode, Unit, Color } from '../types'
import createDeleteInteraction from './utils/createDeleteInteraction'
import createInteractions from './utils/createInteractions'
import createStyleFunc from './utils/createStyleFunc'

export const makeActions = () => {
  let interactions: Interaction[] = []
  const drawSource = new VectorSource()
  const drawLayer = new VectorLayer({ source: drawSource })

  const actions: PolarActionTree<MeasureState, MeasureGetters> = {
    createDeleteInteraction,
    createInteractions,
    createStyleFunc,
    // creates the drawing layer for measuring
    setupModule({ dispatch, rootGetters: { map } }) {
      map.addLayer(drawLayer)
      dispatch('updateInteractions')
    },
    // updates the color for the drawings
    setLineColor({ commit, dispatch }, color: Color) {
      commit('setColor', color)
      dispatch('updateInteractions')
    },
    // updates the color for the drawn texts along the lines
    setTextColor({ commit, dispatch }, color: Color) {
      commit('setTextColor', color)
      dispatch('updateInteractions')
    },
    // sets the Modus
    setMode({ commit, dispatch }, mode: Mode) {
      commit('setMode', mode)
      dispatch('updateInteractions')
    },
    // sets the mode for drawing (Polygon/LineString)
    setMeasureMode({ commit, dispatch }, measureMode) {
      commit('setMeasureMode', measureMode)
      dispatch('updateInteractions')
    },
    // sets the unit for the measurements
    setUnit({ commit, dispatch }, unit: Unit) {
      commit('setUnit', unit)
      dispatch('updateInteractions')
    },
    // updates the selected feature andf connected properties
    setSelectedFeature({ commit }, feature: Feature | null) {
      commit('setSelectedFeature', feature)
      commit('setGeometry')
      commit('setSelectedUnit')
      commit('setMeasure')
    },
    // clears the measuring layer
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
