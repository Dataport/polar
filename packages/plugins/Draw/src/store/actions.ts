import { DrawMode, MeasureMode, PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { Circle, Point } from 'ol/geom'
import { Interaction, Select } from 'ol/interaction'
import VectorSource from 'ol/source/Vector'
import { DrawGetters, DrawState, Mode } from '../types'
import createDrawLayer from '../utils/createDrawLayer'
import createDrawStyle from '../utils/createDrawStyle'
import { createTextStyle } from '../utils/createTextStyle'
import createInteractions from './createInteractions'
import { createCutInteractions } from './createInteractions/createCutInteractions'
import createDeleteInteractions from './createInteractions/createDeleteInteractions'
import createDrawInteractions from './createInteractions/createDrawInteractions'
import { createDuplicateInteractions } from './createInteractions/createDuplicateInteractions'
import createLassoInteractions from './createInteractions/createLassoInteractions'
import { createMergeInteractions } from './createInteractions/createMergeInteractions'
import createModifyInteractions from './createInteractions/createModifyInteractions'
import createTextInteractions from './createInteractions/createTextInteractions'
import createTranslateInteractions from './createInteractions/createTranslateInteractions'
import modifyDrawStyle from './createInteractions/modifyDrawStyle'
import modifyTextStyle from './createInteractions/modifyTextStyle'
import { reviseFeatures } from './reviseFeatures'
import { complete } from './reviseFeatures/revisionStates'

export const makeActions = () => {
  let interactions: Interaction[] = []
  let drawLayer
  const drawSource = new VectorSource()

  const actions: PolarActionTree<DrawState, DrawGetters> = {
    createInteractions,
    createDuplicateInteractions,
    createCutInteractions,
    createMergeInteractions,
    createDrawInteractions,
    createLassoInteractions,
    createModifyInteractions,
    createTranslateInteractions,
    createDeleteInteractions,
    createTextInteractions,
    modifyDrawStyle,
    modifyTextStyle,
    reviseFeatures,
    setupModule({ commit, dispatch, getters, rootGetters: { map } }) {
      dispatch('initializeConfigStyle')
      drawSource.on(['addfeature', 'changefeature', 'removefeature'], () =>
        commit('updateFeatures')
      )
      drawLayer = createDrawLayer(drawSource, getters.configuration?.style)

      map.addLayer(drawLayer)
      dispatch('updateInteractions')

      const drawModes = Object.keys(getters.selectableDrawModes)
      if (!drawModes.includes('Point')) {
        commit('setDrawMode', drawModes[0])
      }
      if (getters.measureOptions.initialOption) {
        commit('setMeasureMode', getters.measureOptions.initialOption)
      }

      if (getters.configuration.revision) {
        // not inactive, and initially complete due to still being empty
        commit('setFeatureCollectionRevisionState', complete)
        this.watch(
          () => getters.featureCollection,
          () => dispatch('reviseFeatures')
        )
      }
    },
    async setDrawMode({ commit, dispatch }, drawMode: DrawMode) {
      commit('setDrawMode', drawMode)
      await dispatch('updateInteractions')
    },
    /** Please consult the README.md before usage. */
    async setInteractions(
      { dispatch, rootGetters },
      newInteractions: Interaction[]
    ) {
      dispatch('setMode', 'none')
      await dispatch('updateInteractions')
      interactions = newInteractions
      interactions.forEach((interaction) =>
        rootGetters.map.addInteraction(interaction)
      )
    },
    setMeasureMode({ commit, dispatch }, measureMode: MeasureMode) {
      commit('setMeasureMode', measureMode)
      dispatch('updateInteractions')
    },
    async setMode({ commit, dispatch }, mode: Mode) {
      commit('setMode', mode)
      await dispatch('updateInteractions')
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
      {
        commit,
        dispatch,
        getters: { configuration, measureMode, mode, selectedFeature },
        rootGetters: { map },
      },
      selectedStrokeColor
    ) {
      const featureStyle = selectedFeature?.getStyle()
      if (mode === 'draw') {
        commit('setSelectedStrokeColor', selectedStrokeColor)
        dispatch('updateInteractions')
      } else if (selectedFeature && featureStyle) {
        const style = createDrawStyle(
          selectedFeature.getGeometry()?.getType() || mode,
          selectedStrokeColor,
          measureMode,
          map.getView().getProjection(),
          configuration?.style
        )
        selectedFeature.setStyle(style)
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
      interactions.forEach(
        (interaction) =>
          // @ts-expect-error | "un on removal" riding piggyback as _onRemove
          map.removeInteraction(interaction) && interaction._onRemove?.()
      )
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
    initializeConfigStyle: ({ commit, getters: { configuration } }) => {
      if (configuration?.style?.stroke?.color) {
        commit('setSelectedStrokeColor', configuration.style.stroke.color)
      }
    },
  }

  return { actions, drawSource }
}
