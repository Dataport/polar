import debounce from 'lodash.debounce'
import { Feature as GeoJsonFeature } from 'geojson'
import { Style, Fill, Stroke } from 'ol/style'
import { GeoJSON } from 'ol/format'
import { Feature } from 'ol'
import { PolarActionTree } from '@polar/lib-custom-types'
import { getFeatureDisplayLayer, clear } from '../../utils/displayFeatureLayer'
import { FeaturesByLayerId, GfiGetters, GfiState } from '../../types'
import { filterFeatures } from '../../utils/filterFeatures'
import { renderFeatures } from '../../utils/renderFeatures'
import { debouncedGfiRequest } from './debouncedGfiRequest'
import {
  setupCoreListener,
  setupMultiSelection,
  setupTooltip,
  setupZoomListeners,
} from './setup'

// OK for module action set creation
// eslint-disable-next-line max-lines-per-function
export const makeActions = () => {
  const writer = new GeoJSON()
  const featureDisplayLayer = getFeatureDisplayLayer()

  let debouncedVisibilityChangeIndicator

  const actions: PolarActionTree<GfiState, GfiGetters> = {
    /**
     * Responsible for setting up the module by
     * - adding watchers to configured coordinate sources. Whenever one of these
     *   sources changes, the module is reset and all information is fetched
     *   anew.
     * - adding the geometry display layer to the map.
     */
    setupModule({
      getters: { gfiConfiguration, defaultHighlightStyle },
      rootGetters,
      dispatch,
    }): void {
      const { coordinateSources, customHighlightStyle } = gfiConfiguration
      const { map } = rootGetters

      const reaction = (coordinate) => {
        clear(featureDisplayLayer)
        if (coordinate && coordinate.length) {
          dispatch('getFeatureInfo', { coordinateOrExtent: coordinate })
        }
      }

      coordinateSources.forEach((coordinateSource) =>
        this.watch(() => rootGetters[coordinateSource], reaction)
      )

      map.addLayer(featureDisplayLayer)
      featureDisplayLayer.setStyle(
        new Style({
          stroke: new Stroke(
            customHighlightStyle?.stroke || defaultHighlightStyle.stroke
          ),
          fill: new Fill(
            customHighlightStyle?.fill || defaultHighlightStyle.fill
          ),
        })
      )

      dispatch('setupTooltip')
      dispatch('setupFeatureVisibilityUpdates')
      dispatch('setupCoreListener')
      dispatch('setupZoomListeners')
      dispatch('setupMultiSelection')
    },
    setupCoreListener,
    setupMultiSelection,
    setupTooltip,
    setupZoomListeners,
    setupFeatureVisibilityUpdates({ commit, state, getters, rootGetters }) {
      // debounce to prevent update spam
      debouncedVisibilityChangeIndicator = debounce(
        () =>
          commit(
            'setVisibilityChangeIndicator',
            state.visibilityChangeIndicator + 1
          ),
        10
      )
      rootGetters.map
        .getLayers()
        .getArray()
        .forEach((layer) => {
          if (getters.layerKeys.includes(layer.get('id'))) {
            layer
              // @ts-expect-error | layers reaching this have a source
              .getSource()
              .on('addfeature', debouncedVisibilityChangeIndicator)
          }
        })
    },
    close({ commit, dispatch, rootGetters }, userInteraction = false) {
      commit('clearFeatureInformation')
      commit('setImageLoaded', false)
      // NOTE: null is needed, as the payload is always the second argument...
      if (
        !rootGetters.configuration?.extendedMasterportalapiMarkers &&
        userInteraction
      ) {
        dispatch('plugin/pins/removeMarker', null, { root: true })
      }
      dispatch('setCoreSelection', { feature: null })
      clear(featureDisplayLayer) // ... features of gfi layer
    },
    /**
     * Action getFeatureInfo
     * 1. resets the module state
     * 2. fetches new feature information for each configured layer
     * 3. adds features to the display layer optionally (if configured)
     */
    async getFeatureInfo(
      { commit, dispatch },
      coordinateOrExtent: [number, number] | [number, number, number, number]
    ): Promise<GeoJsonFeature[]> {
      if (coordinateOrExtent.length === 2) {
        commit('clearFeatureInformation')
        commit('setVisibleWindowFeatureIndex', 0)
      }
      clear(featureDisplayLayer)
      // call further stepped in a debounced fashion to avoid a mess
      return await dispatch('debouncedGfiRequest', coordinateOrExtent)
    },
    debouncedGfiRequest: debouncedGfiRequest(featureDisplayLayer),
    setCoreSelection(
      { commit, dispatch, rootGetters },
      {
        feature,
        centerOnFeature = false,
      }: { feature: Feature | null; centerOnFeature?: boolean }
    ) {
      if (rootGetters.selected !== feature) {
        commit('setSelected', feature, { root: true })
        dispatch(
          'updateSelection',
          { feature, centerOnFeature },
          { root: true }
        )
      }
    },
    setOlFeatureInformation(
      { commit, dispatch },
      {
        feature,
        centerOnFeature = false,
      }: { feature: Feature | null; centerOnFeature?: boolean }
    ) {
      commit('clearFeatureInformation')
      commit('setVisibleWindowFeatureIndex', 0)
      clear(featureDisplayLayer)
      if (feature !== null) {
        commit('setFeatureInformation', {
          [feature.get('_gfiLayerId')]: feature.get('features')?.length
            ? feature
                .get('features')
                .map((feature) => JSON.parse(writer.writeFeature(feature)))
            : [JSON.parse(writer.writeFeature(feature))],
        })
        dispatch('setCoreSelection', { feature, centerOnFeature })
      }
    },
    setFeatureInformation(
      { commit, getters },
      featuresByLayerId: FeaturesByLayerId
    ) {
      commit('clearFeatureInformation')
      commit('setVisibleWindowFeatureIndex', 0)
      clear(featureDisplayLayer)

      const filteredFeatures = Object.fromEntries(
        Object.entries(filterFeatures(featuresByLayerId)).map(
          ([layerId, features]) => {
            const { isSelectable } = getters.gfiConfiguration.layers[layerId]
            return [
              layerId,
              typeof isSelectable === 'function'
                ? features.filter((feature) => isSelectable(feature))
                : features,
            ]
          }
        )
      )
      commit('setFeatureInformation', filteredFeatures)
      renderFeatures(
        featureDisplayLayer,
        getters.geometryLayerKeys,
        filteredFeatures
      )
    },
    hover({ commit, rootGetters }, feature: Feature) {
      if (rootGetters.configuration.extendedMasterportalapiMarkers) {
        commit('setHovered', feature, { root: true })
      }
    },
    unhover({ commit, rootGetters }) {
      if (rootGetters.configuration.extendedMasterportalapiMarkers) {
        commit('setHovered', null, { root: true })
      }
    },
  }

  return actions
}
