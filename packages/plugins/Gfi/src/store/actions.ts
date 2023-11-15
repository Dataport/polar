import debounce from 'lodash.debounce'
import { Coordinate } from 'ol/coordinate'
import { Feature as GeoJsonFeature } from 'geojson'
import { Style, Fill, Stroke } from 'ol/style'
import { rawLayerList } from '@masterportal/masterportalapi/src'
import { PolarActionTree } from '@polar/lib-custom-types'
import {
  featureDisplayLayer,
  clear,
  addFeature,
} from '../utils/displayFeatureLayer'
import { requestGfi } from '../utils/requestGfi'
import { GfiGetters, GfiState } from '../types'
import sortFeatures from '../utils/sortFeatures'

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
  },
  close({ commit, dispatch }) {
    commit('clearFeatureInformation')
    // NOTE: null is needed, as the payload is always the second argument...
    dispatch('plugin/pins/removeMarker', null, { root: true })
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
            : (console.error(result), errorSymbol(result.reason.message))
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

      // render feature geometries to help layer
      geometryLayerKeys
        .filter((key) => Array.isArray(featuresByLayerId[key]))
        // @ts-expect-error | Might be fixed through having all the types in the action. Otherwise: It works properly, as all the symbols are filtered in line 168.
        .forEach((key) => featuresByLayerId[key].forEach(addFeature))
    },
    50
  ),
}

export default actions
