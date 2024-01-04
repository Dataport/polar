import debounce from 'lodash.debounce'
import compare from 'just-compare'
import { Coordinate } from 'ol/coordinate'
import { Style, Fill, Stroke } from 'ol/style'
import Overlay from 'ol/Overlay'
import { GeoJSON } from 'ol/format'
import { Feature } from 'ol'
import { Feature as GeoJsonFeature, GeoJsonProperties } from 'geojson'
import { rawLayerList } from '@masterportal/masterportalapi/src'
import { PolarActionTree } from '@polar/lib-custom-types'
import getCluster from '@polar/lib-get-cluster'
import { isVisible } from '@polar/lib-invisible-style'
import { getTooltip, Tooltip } from '@polar/lib-tooltip'
import {
  featureDisplayLayer,
  clear,
  addFeature,
} from '../../utils/displayFeatureLayer'
import { requestGfi } from '../../utils/requestGfi'
import { GfiGetters, GfiState } from '../../types'
import sortFeatures from '../../utils/sortFeatures'

const writer = new GeoJSON()

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
      clear()
      if (coordinate && coordinate.length) {
        dispatch('getFeatureInfo', coordinate)
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
  },
  setupCoreListener({ getters: { gfiConfiguration }, rootGetters, dispatch }) {
    if (gfiConfiguration.featureList?.bindWithCoreHoverSelect) {
      this.watch(
        () => rootGetters.selected,
        (selectedFeature) =>
          dispatch('setOlFeatureInformation', selectedFeature),
        { deep: true }
      )
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
            const originalFeature = listableLayerSources
              .map((source) =>
                source
                  .getFeatures()
                  .filter(isVisible)
                  .map((feature) => {
                    // true = silent change (prevents cluster recomputation & rerender)
                    feature.set('_gfiLayerId', source.get('_gfiLayerId'), true)
                    return feature
                  })
              )
              .flat(1)
              .find((f) =>
                compare(
                  JSON.parse(new GeoJSON().writeFeature(f)).properties,
                  selectedFeatureProperties
                )
              )
            if (originalFeature) {
              dispatch(
                'setOlFeatureInformation',
                getCluster(rootGetters.map, originalFeature, '_gfiLayerId')
              )
            }
          }
        }
      )
    }
  },
  setupTooltip({ getters: { gfiConfiguration }, rootGetters: { map } }) {
    const tooltipLayerIds = Object.keys(gfiConfiguration.layers).filter(
      (key) => gfiConfiguration.layers[key].showTooltip
    )
    if (!tooltipLayerIds.length) {
      return
    }

    let element: Tooltip['element'], unregister: Tooltip['unregister']
    const overlay = new Overlay({
      positioning: 'bottom-center',
      offset: [0, -5],
    })
    map.addOverlay(overlay)
    map.on('pointermove', ({ pixel, dragging }) => {
      if (dragging) {
        return
      }
      let hasFeatureAtPixel = false
      // stops on return `true`, thus only using the uppermost feature
      map.forEachFeatureAtPixel(
        pixel,
        (feature, layer) => {
          if (!(feature instanceof Feature)) {
            return false
          }
          hasFeatureAtPixel = true
          overlay.setPosition(map.getCoordinateFromPixel(pixel))
          if (unregister) {
            unregister()
          }
          ;({ element, unregister } = getTooltip({
            localeKeys:
              // @ts-expect-error | it exists by virtue of layerFilter below
              gfiConfiguration.layers[layer.get('id')].showTooltip(
                feature,
                map
              ),
          }))
          overlay.setElement(element)
          return true
        },
        { layerFilter: (layer) => tooltipLayerIds.includes(layer.get('id')) }
      )
      if (!hasFeatureAtPixel) {
        overlay.setPosition(undefined)
      }
    })
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
    const usedLayers = Object.keys(getters.gfiConfiguration.layers)
    rootGetters.map
      .getLayers()
      .getArray()
      .forEach((layer) => {
        if (usedLayers.includes(layer.get('id'))) {
          layer
            // @ts-expect-error | layers reaching this have a source
            .getSource()
            .on('addfeature', debouncedVisibilityChangeIndicator)
        }
      })
  },
  close({ commit, dispatch, rootGetters }) {
    commit('clearFeatureInformation')
    commit('setImageLoaded', false)
    // NOTE: null is needed, as the payload is always the second argument...
    if (!rootGetters.configuration?.extendedMasterportalapiMarkers) {
      dispatch('plugin/pins/removeMarker', null, { root: true })
    }
    dispatch('setCoreSelection', null)
    clear() // ... features of gfi layer
  },
  /**
   * Action getFeatureInfo
   * 1. resets the module state
   * 2. fetches new feature information for each configured layer
   * 3. adds features to the display layer optionally (if configured)
   */
  async getFeatureInfo(
    { commit, dispatch },
    coordinate: Coordinate
  ): Promise<GeoJsonFeature[]> {
    commit('clearFeatureInformation')
    commit('setVisibleWindowFeatureIndex', 0)
    clear()
    // call further stepped in a debounced fashion to avoid a mess
    return await dispatch('debouncedGfiRequest', coordinate)
  },
  /**
   * Code from `getFeatureInfo`, pulled to avoid overly requesting feature
   * information. Since sources in Pins plugin update right after each other
   * (and such effects are to be expected across the system), we're debouncing
   * this *after* resetting the module state, as something is bound to happen.
   */
  debouncedGfiRequest: debounce(
    // TODO: Types are not properly displayed here as it is wrapped through debounce
    async (
      {
        commit,
        rootGetters: { map, configuration },
        getters: { layerKeys, geometryLayerKeys, afterLoadFunction },
      },
      coordinate: Coordinate
    ): Promise<void> => {
      // fetch new feature information for all configured layers
      const promisedFeatures: Promise<GeoJsonFeature[]>[] = layerKeys.map(
        (key) => {
          const layer = map
            .getLayers()
            .getArray()
            .find((layer) => layer.getProperties().id === key)

          if (!layer) {
            console.error(
              `No layer with id "${key}" found during run-time. GFI skipped.`
            )
            return [] as GeoJsonFeature[]
          }

          const layerConfiguration = configuration.gfi.layers[key] || {}
          const layerSpecification = rawLayerList.getLayerWhere({ id: key })
          const mainLayerConfiguration = configuration.layers.find(
            (element) => element.id === key
          )
          const layerGfiMode =
            mainLayerConfiguration.gfiMode ||
            configuration.gfi.mode ||
            'bboxDot'

          return requestGfi({
            map,
            layer,
            coordinate,
            layerConfiguration,
            layerSpecification,
            mode: layerGfiMode,
          })
        }
      )

      const errorSymbol = (err) => Symbol(err)
      const features = (await Promise.allSettled(promisedFeatures)).map(
        (result) =>
          result.status === 'fulfilled'
            ? result.value
            : errorSymbol(result.reason.message)
      )

      const generalMaxFeatures: number =
        configuration.gfi.maxFeatures || Number.POSITIVE_INFINITY

      const srsName: string = map.getView().getProjection().getCode()
      // map features back to their layer keys
      let featuresByLayerId: Record<string, GeoJsonFeature[] | symbol> =
        layerKeys.reduce(
          (accumulator, key, index) => ({
            ...accumulator,
            [key]: Array.isArray(features[index])
              ? (features[index] as []).slice(
                  0,
                  configuration.gfi.layers[key].maxFeatures ||
                    generalMaxFeatures
                )
              : features[index],
          }),
          {}
        )
      featuresByLayerId = Object.entries(featuresByLayerId).reduce(
        (accumulator, [layerKey, layerValues]) => ({
          ...accumulator,
          [layerKey]:
            Array.isArray(layerValues) && layerValues.length >= 2
              ? layerValues.sort((a, b) => sortFeatures(a, b, srsName))
              : layerValues,
        }),
        {}
      )

      // store features in state, if configured via client specific function
      if (typeof afterLoadFunction === 'function') {
        featuresByLayerId = await afterLoadFunction(featuresByLayerId, srsName)
      }
      commit('setFeatureInformation', featuresByLayerId)
      console.warn('man :(', featuresByLayerId)

      // render feature geometries to help layer
      geometryLayerKeys
        .filter((key) => Array.isArray(featuresByLayerId[key]))
        // @ts-expect-error | Might be fixed through having all the types in the action. Otherwise: It works properly, as all the symbols are filtered before calling forEach
        .forEach((key) => featuresByLayerId[key].forEach(addFeature))
    },
    50
  ),
  setCoreSelection({ commit, rootGetters }, feature: Feature | null) {
    if (rootGetters.selected !== feature) {
      commit('setSelected', feature, { root: true })
    }
  },
  setOlFeatureInformation({ commit, dispatch }, feature: Feature | null) {
    commit('clearFeatureInformation')
    commit('setVisibleWindowFeatureIndex', 0)
    clear()
    if (feature !== null) {
      commit('setFeatureInformation', {
        [feature.get('_gfiLayerId')]: feature.get('features')?.length
          ? feature
              .get('features')
              .map((feature) => JSON.parse(writer.writeFeature(feature)))
          : [JSON.parse(writer.writeFeature(feature))],
      })
      dispatch('setCoreSelection', feature)
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

export default actions
