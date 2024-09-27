import VectorSource from 'ol/source/Vector'
import { Interaction, Select } from 'ol/interaction'
import { PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { Circle, Point } from 'ol/geom'
import VectorLayer from 'ol/layer/Vector'
import { DrawGetters, DrawState } from '../types'
import { createTextStyle } from '../utils/createTextStyle'
import createDrawStyle from '../utils/createDrawStyle'
import { castArrayToRgba } from '../utils/castColors'
import createInteractions from './createInteractions'
import createModifyInteractions from './createInteractions/createModifyInteractions'
import modifyDrawStyle from './createInteractions/modifyDrawStyle'
import modifyTextStyle from './createInteractions/modifyTextStyle'

// OK for module action set creation
// eslint-disable-next-line max-lines-per-function
export const makeActions = () => {
  let interactions: Interaction[] = []
  let drawLayer
  const drawSource = new VectorSource()

  const actions: PolarActionTree<DrawState, DrawGetters> = {
    createInteractions,
    createModifyInteractions,
    modifyDrawStyle,
    modifyTextStyle,
    setupModule({
      commit,
      dispatch,
      getters: { configuration },
      rootGetters: { map },
    }) {
      dispatch('initializeConfigStyle')
      drawSource.on(['addfeature', 'changefeature', 'removefeature'], () =>
        commit('updateFeatures')
      )
      drawLayer = new VectorLayer({ source: drawSource })

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
    setSelectedStrokeColor(
      { commit, dispatch, getters: { configuration, selectedFeature, mode } },
      selectedStrokeColor
    ) {
      const geomType = `${mode.charAt(0).toLowerCase()}${mode.slice(1)}`
      const configStyle = configuration
        ? configuration[`${geomType}Style`]
        : undefined
      if (mode === 'draw') {
        console.warn(selectedStrokeColor)
        commit('setSelectedStrokeColor', selectedStrokeColor)
        dispatch('updateInteractions')
      } else if (selectedFeature && configStyle) {
        const style = createDrawStyle(
          selectedFeature?.getGeometry()?.getType() || mode,
          selectedStrokeColor.toString(),
          configStyle
        )
        if (style) selectedFeature.setStyle(style)
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
    async updateInteractions({
      commit,
      dispatch,
      getters: { selectedFeature },
      rootGetters: { map },
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
      // await is needed as dispatch *may* return a Promise
      interactions = await dispatch('createInteractions', {
        drawSource,
        drawLayer,
      })
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
    initializeConfigStyle: ({
      commit,
      getters: { drawMode, configuration },
    }) => {
      const geomType = `${drawMode.charAt(0).toLowerCase()}${drawMode.slice(1)}`
      const style = configuration
        ? configuration[`${geomType}Style`]
        : undefined
      const attributeStrokeColor =
        drawMode === 'LineString'
          ? 'lineStrokeColor'
          : drawMode === 'Polygon'
          ? `${geomType}StrokeColor`
          : 'circleStrokeColor'
      const strokeColor = style
        ? style[attributeStrokeColor]
        : { r: 0, g: 0, b: 0, a: 1 }
      commit('setSelectedStrokeColor', castArrayToRgba(strokeColor))
    },
  }

  return { actions, drawSource }
}
