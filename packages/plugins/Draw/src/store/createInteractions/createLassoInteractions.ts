import Draw from 'ol/interaction/Draw'
import Interaction from 'ol/interaction/Interaction'
import i18next from 'i18next'
import { rawLayerList } from '@masterportal/masterportalapi'
import { MapConfig, PolarActionContext } from '@polar/lib-custom-types'
import { Dispatch } from 'vuex'
import { Feature, Map } from 'ol'
import { Polygon } from 'ol/geom'
import { getWfsFeatures } from '@polar/lib-get-features'
import { FeatureCollection, Feature as GeoJsonFeature } from 'geojson'
import { DrawGetters, DrawState } from '../../types'

const loaderKey = 'drawLasso'

// TODO un – refactor after done (actions/getters are mixed here)
/* eslint-disable max-lines-per-function */

const getLassoIdsInZoomRange = (
  configuration: MapConfig,
  zoomLevel: number,
  dispatch: Dispatch
) =>
  (configuration.draw?.lassos || []).reduce(
    (accumulator, { id, minZoom = true }) => {
      const layerConfig = configuration.layers?.find((layer) => id === layer.id)
      const toastAction = configuration.draw?.toastAction || ''
      if (
        minZoom &&
        layerConfig &&
        typeof layerConfig.minZoom !== 'undefined' &&
        zoomLevel < layerConfig.minZoom
      ) {
        if (toastAction) {
          dispatch(
            toastAction,
            {
              type: 'info',
              text: i18next.t('plugins.draw.lasso.notInZoomRange', {
                serviceName: layerConfig.name || id,
              }),
              timeout: 10000,
            },
            { root: true }
          )
        } else {
          console.warn(
            `Lasso not used with layer with id "${id}". (minZoom not reached)`
          )
        }
        return accumulator
      }
      accumulator.push(id)
      return accumulator
    },
    [] as string[]
  )

const getLassoRequests = (
  lassoIds: string[],
  lasso: Feature<Polygon>,
  map: Map
) =>
  lassoIds.reduce((accumulator, id) => {
    const serviceDefinition = rawLayerList.getLayerWhere({ id })

    // TODO add WFS support
    // getWfsFeatures(null, serviceDefinition.url, ) FILTER-ONLY atm

    const [codeName, codeNumber] = map
      .getView()
      .getProjection()
      .getCode()
      .split(':')

    const url = [
      serviceDefinition.url,
      'collections',
      serviceDefinition.collection,
      `items?f=json&limit=100&bbox=${lasso
        .getGeometry()
        ?.getExtent()}&bbox-crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}&crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}`,
    ].join('/')

    accumulator.push(fetch(url))
    return accumulator
  }, [] as Promise<Response>[])

/*
TODO use snippet to confirm the layer type worked on
    const source = (
      map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === layerId) as VectorLayer
    )?.getSource?.()
    if (source instanceof VectorSource) {
      accumulator.push(new Snap({ source }))
    } else {
      console.warn(
        `@polar/plugin-draw: Layer with ID "${layerId}" configured for 'snapTo', but it has no source to snap to. The layer does probably not hold any vector data.`
      )
    }
      */

const handleSettledRequests = (
  resolutions: PromiseSettledResult<Response>[],
  dispatch: Dispatch
) =>
  Promise.all(
    (
      resolutions.filter((promiseSettledResult) => {
        if (promiseSettledResult.status === 'rejected') {
          console.error(promiseSettledResult.reason)
          // TODO toast
          return false
        }
        return true
      }) as PromiseFulfilledResult<Response>[]
    ).map(
      async (resolution) => (await resolution.value.json()) as FeatureCollection
    )
  )

const handleFulfilledRequests = (
  featureCollections: FeatureCollection[],
  dispatch: Dispatch
) =>
  dispatch('addFeatures', {
    geoJSON: {
      type: 'FeatureCollection',
      features: featureCollections.reduce(
        (accumulator, { features }) => accumulator.concat(features),
        [] as GeoJsonFeature[]
      ),
    },
    // TODO filter with drawnLasso
  })

export default function ({
  rootGetters,
  commit,
  dispatch,
}: PolarActionContext<DrawState, DrawGetters>): Interaction[] {
  const draw = new Draw({
    type: 'Polygon',
    freehand: true,
  })
  const { addLoading, removeLoading } = rootGetters.configuration?.draw || {}
  draw.on('drawend', (e) => {
    dispatch('setMode', 'none')

    const drawnLasso = e.feature as Feature<Polygon> // due to Draw 'type' param
    const lassoIds = getLassoIdsInZoomRange(
      rootGetters.configuration,
      rootGetters.zoomLevel,
      dispatch
    )
    const requests = getLassoRequests(lassoIds, drawnLasso, rootGetters.map)

    if (addLoading) {
      commit(addLoading, loaderKey, { root: true })
    }
    Promise.allSettled(requests)
      .then((settledRequests) =>
        handleSettledRequests(settledRequests, dispatch)
      )
      .then((fulfilledRequests) =>
        handleFulfilledRequests(fulfilledRequests, dispatch)
      )
      // TODO add toast, unexpected catastrophic error
      .catch(console.error)
      .finally(
        () => removeLoading && commit(removeLoading, loaderKey, { root: true })
      )
  })

  return [draw]
}
