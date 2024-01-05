import VectorSource from 'ol/source/Vector'
import { Interaction, Select } from 'ol/interaction'
import { PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { Circle, Point } from 'ol/geom'
import createDrawLayer from '../utils/createDrawLayer'
import { DrawGetters, DrawState } from '../types'
import { createTextStyle } from '../utils/createTextStyle'
import createInteractions from './createInteractions'

// OK for module action set creation
// eslint-disable-next-line max-lines-per-function
export const makeActions = () => {
  let interactions: Interaction[] = []
  let drawLayer
  const drawSource = new VectorSource()

  const actions: PolarActionTree<DrawState, DrawGetters> = {
    setupModule({ commit, dispatch, rootGetters: { configuration, map } }) {
      drawSource.on(['addfeature', 'changefeature', 'removefeature'], () =>
        commit('updateFeatures')
      )
      drawLayer = createDrawLayer(drawSource, configuration?.draw?.style)

      map.addLayer(drawLayer)
      dispatch('updateInteractions')
    },
    setMode({ commit, dispatch }, mode) {
      commit('setMode', mode)
      dispatch('updateInteractions')
    },
    setDrawMode({ commit, dispatch }, drawMode) {
      commit('setDrawMode', drawMode)
      dispatch('updateInteractions')
    },
    setTextInput(
      {
        commit,
        dispatch,
        rootGetters: { configuration },
        getters: { selectedFeature, mode, textSize },
      },
      textInput
    ) {
      commit('setTextInput', textInput)
      if (mode === 'draw') {
        dispatch('updateInteractions')
      } else if (selectedFeature) {
        selectedFeature.setStyle(
          createTextStyle(textInput, configuration.draw?.textStyle, textSize)
        )
        selectedFeature.set('text', textInput)
        commit('updateFeatures')
      }
    },
    setSelectedSize(
      {
        commit,
        dispatch,
        rootGetters: { configuration },
        getters: { selectedFeature, mode, textInput, fontSizes },
      },
      selectedSize
    ) {
      commit('setSelectedSize', selectedSize)
      // textSize must be recalculated with new selectedSize
      const textSize = fontSizes[selectedSize]
      if (mode === 'draw') {
        dispatch('updateInteractions')
      } else if (selectedFeature) {
        selectedFeature.setStyle(
          createTextStyle(textInput, configuration.draw?.textStyle, textSize)
        )
        commit('updateFeatures')
      }
    },
    updateInteractions({
      commit,
      getters: {
        mode,
        drawMode,
        textInput,
        selectedFeature,
        textSize,
        fontSizes,
      },
      rootGetters: { map, configuration },
    }) {
      interactions.forEach((interaction) => map.removeInteraction(interaction))
      if (interactions.some((interaction) => interaction instanceof Select)) {
        if (selectedFeature && selectedFeature.get('text') === '') {
          // text nodes without text are considered deleted
          drawSource.removeFeature(selectedFeature)
          commit('updateFeatures')
        }
        commit('setSelectedFeature', null) // select removal = deselect
        commit('setTextInput', '')
      }
      interactions = createInteractions(
        {
          commit,
          getters: { mode, drawMode, textInput, fontSizes },
          rootGetters: { configuration },
          textSize,
        },
        drawSource,
        drawLayer
      )
      interactions.forEach((interaction) => map.addInteraction(interaction))
    },
    zoomToFeature({ dispatch }, { index = 0, margin }) {
      const feature = drawSource.getFeatures()[index] // TODO parameter is weird, one has to know in which order the features where added
      if (feature) {
        dispatch('zoomTo', { geometryOrExtent: feature.getGeometry(), margin })
      }
    },
    zoomToAllFeatures({ dispatch }, { margin }) {
      dispatch('zoomTo', { geometryOrExtent: drawSource.getExtent(), margin })
    },
    /**
     * Zoom to one or all features of the draw layer.
     */
    zoomTo({ rootGetters }, { geometryOrExtent, margin }) {
      const m = margin || 20
      rootGetters.map.getView().fit(geometryOrExtent, { padding: [m, m, m, m] })
    },
    addFeatures({ commit }, { geoJSON, overwrite = false }) {
      const features = new GeoJSON().readFeatures(geoJSON).map((feature) => {
        const geometry = feature.getGeometry()
        const radius = feature.getProperties().radius

        if (geometry?.getType() === 'Point' && radius) {
          feature.setGeometry(
            new Circle((geometry as Point).getCoordinates(), radius)
          )
        }
        return feature
      })

      if (overwrite) {
        drawSource.clear()
      }
      drawSource.addFeatures(features)
      commit('updateFeatures')
    },
  }

  return { actions, drawSource }
}
