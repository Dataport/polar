import debounce from 'lodash.debounce'
import { Style, Fill, Stroke } from 'ol/style'
import { GeoJSON } from 'ol/format'
import { Feature } from 'ol'
import { Feature as GeoJsonFeature, GeoJsonProperties } from 'geojson'
import { PolarActionTree } from '@polar/lib-custom-types'
import getCluster from '@polar/lib-get-cluster'
import { DragBox, Draw, Modify } from 'ol/interaction'
import { platformModifierKeyOnly } from 'ol/events/condition'
import { getFeatureDisplayLayer, clear } from '../../utils/displayFeatureLayer'
import { GfiGetters, GfiState } from '../../types'
import { getOriginalFeature } from '../../utils/getOriginalFeature'
import { setupTooltip } from './setupTooltip'
import { debouncedGfiRequest } from './debouncedGfiRequest'

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
    setupTooltip,
    setupCoreListener({
      getters: { gfiConfiguration },
      rootGetters,
      dispatch,
    }) {
      if (gfiConfiguration.featureList?.bindWithCoreHoverSelect) {
        this.watch(
          () => rootGetters.selected,
          (feature) => dispatch('setOlFeatureInformation', { feature }),
          { deep: true }
        )
      }
    },
    setupMultiSelection({ dispatch, getters, rootGetters }) {
      if (getters.gfiConfiguration.boxSelect) {
        const dragBox = new DragBox({ condition: platformModifierKeyOnly })
        dragBox.on('boxend', () =>
          dispatch('getFeatureInfo', {
            coordinateOrExtent: dragBox.getGeometry().getExtent(),
            modifierPressed: true,
          })
        )
        rootGetters.map.addInteraction(dragBox)
      }
      if (getters.gfiConfiguration.directSelect) {
        rootGetters.map.on('click', ({ coordinate, originalEvent }) => {
          const isDrawing = rootGetters.map
            .getInteractions()
            .getArray()
            .some(
              (interaction) =>
                // these indicate other interactions are expected now
                interaction instanceof Draw ||
                interaction instanceof Modify ||
                // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
                interaction._isDeleteSelect ||
                // @ts-expect-error | internal hack to detect it from @polar/plugin-measure
                interaction._isMeasureSelect
            )
          if (!isDrawing) {
            dispatch('getFeatureInfo', {
              coordinateOrExtent: coordinate,
              modifierPressed:
                navigator.userAgent.indexOf('Mac') !== -1
                  ? originalEvent.metaKey
                  : originalEvent.ctrlKey,
            })
          }
        })
      }
    },
    setupZoomListeners({ dispatch, getters, rootGetters }) {
      if (getters.gfiConfiguration.featureList) {
        this.watch(
          () => rootGetters.zoomLevel,
          () => {
            const {
              featureInformation,
              listableLayerSources,
              visibleWindowFeatureIndex,
              windowFeatures,
            } = getters

            if (windowFeatures.length) {
              const layerId: string =
                // @ts-expect-error | if windowFeatures has features, visibleWindowFeatureIndex is in the range of possible features
                windowFeatures[visibleWindowFeatureIndex].polarInternalLayerKey
              const selectedFeatureProperties: GeoJsonProperties = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                _gfiLayerId: layerId,
                ...featureInformation[layerId][visibleWindowFeatureIndex]
                  .properties,
              }
              const originalFeature = getOriginalFeature(
                listableLayerSources,
                selectedFeatureProperties
              )
              if (originalFeature) {
                dispatch('setOlFeatureInformation', {
                  feature: getCluster(
                    rootGetters.map,
                    originalFeature,
                    '_gfiLayerId'
                  ),
                })
              }
            }
          }
        )
      }
    },
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
