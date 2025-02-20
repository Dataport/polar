import Draw from 'ol/interaction/Draw'
import Interaction from 'ol/interaction/Interaction'
import i18next from 'i18next'
import { GeoJSON } from 'ol/format'
import { booleanContains } from '@turf/boolean-contains'
import { rawLayerList } from '@masterportal/masterportalapi'
import { PolarActionContext } from '@polar/lib-custom-types'
import { Feature } from 'ol'
import { Polygon } from 'ol/geom'
import { parseWfsResponse } from '@polar/lib-get-features/wfs/parse'
import { FeatureCollection, Feature as GeoJsonFeature } from 'geojson'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { DrawGetters, DrawState } from '../../types'

const loaderKey = 'drawLasso'
const supportedFormats = ['OAF', 'WFS']

// TODO un – refactor after done (actions/getters are mixed here)
/* eslint-disable max-lines-per-function */

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
  const toastAction = rootGetters.configuration.draw?.toastAction || ''
  draw.on('drawend', (e) => {
    dispatch('setMode', 'none')

    const drawnLasso = e.feature as Feature<Polygon> // due to Draw 'type' param
    const drawnLassoAsGeoJson = JSON.parse(
      new GeoJSON().writeFeature(drawnLasso)
    )
    const lassoIds = (rootGetters.configuration.draw?.lassos || []).reduce(
      (accumulator, { id, minZoom = true }) => {
        const layerConfig = rootGetters.configuration.layers?.find(
          (layer) => id === layer.id
        )
        if (
          minZoom &&
          layerConfig &&
          typeof layerConfig.minZoom !== 'undefined' &&
          rootGetters.zoomLevel < layerConfig.minZoom
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
    const requests = lassoIds.reduce((accumulator, id) => {
      const serviceDefinition = rawLayerList.getLayerWhere({ id })
      if (!supportedFormats.includes(serviceDefinition.typ)) {
        console.warn(
          `@polar/plugin-draw: Layer with ID "${id} configured for 'lasso, but it's not a supported format. Layer is of type "${serviceDefinition.typ}", but only [${supportedFormats}] are supported.`
        )
        return accumulator
      }

      const source = (
        rootGetters.map
          .getLayers()
          .getArray()
          .find((layer) => layer.get('id') === id) as VectorLayer
      )?.getSource?.()
      if (!(source instanceof VectorSource)) {
        console.warn(
          `@polar/plugin-draw: Layer with ID "${id}" configured for 'lasso', but it has no vector source. The layer does probably not hold any vector data and is skipped.`
        )
        return accumulator
      }

      const code = rootGetters.map.getView().getProjection().getCode()
      const [codeName, codeNumber] = code.split(':')

      const url =
        serviceDefinition.typ === 'OAF'
          ? [
              serviceDefinition.url,
              'collections',
              serviceDefinition.collection,
              `items?f=json&limit=100&bbox=${drawnLasso
                .getGeometry()
                ?.getExtent()}&bbox-crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}&crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}`,
            ].join('/')
          : `${serviceDefinition.url}${[
              `?service=${serviceDefinition.typ}`,
              `version=${serviceDefinition.version}`,
              `request=GetFeature`,
              `srsName=${code}`,
              `typeName=${serviceDefinition.featureType}`,
              `bbox=${drawnLasso.getGeometry()?.getExtent()},${code}`,
            ].join('&')}`

      accumulator.push(fetch(url))
      return accumulator
    }, [] as Promise<Response>[])

    if (addLoading) {
      commit(addLoading, loaderKey, { root: true })
    }
    Promise.allSettled(requests)
      .then((settledRequests) =>
        Promise.all(
          (
            settledRequests.filter((promiseSettledResult, index) => {
              if (promiseSettledResult.status === 'rejected') {
                console.error(
                  '@polar/plugin-draw: Error during reading lasso response from layer.',
                  promiseSettledResult.reason
                )
                if (toastAction) {
                  dispatch(
                    toastAction,
                    {
                      type: 'error',
                      text: i18next.t('plugins.draw.lasso.layerRejected', {
                        id: lassoIds[index],
                      }),
                    },
                    { root: true }
                  )
                }
                return false
              }
              return true
            }) as PromiseFulfilledResult<Response>[]
          ).map(async (resolution, index) =>
            rawLayerList.getLayerWhere({ id: lassoIds[index] }).typ === 'WFS'
              ? await parseWfsResponse(resolution.value, undefined, false)
              : ((await resolution.value.json()) as FeatureCollection)
          )
        )
      )
      .then((featureCollections) =>
        dispatch('addFeatures', {
          geoJSON: {
            type: 'FeatureCollection',
            features: featureCollections
              .reduce(
                (accumulator, { features }) => accumulator.concat(features),
                [] as GeoJsonFeature[]
              )
              .filter((feature) =>
                booleanContains(drawnLassoAsGeoJson, feature)
              ),
          },
        })
      )
      .catch((error) => {
        console.error(
          '@polar/plugin-draw: Client failure in reading responses in lasso action.',
          error
        )
        if (toastAction) {
          dispatch(
            toastAction,
            {
              type: 'error',
              text: i18next.t('plugins.draw.lasso.fatalError'),
            },
            { root: true }
          )
        }
      })
      .finally(
        () => removeLoading && commit(removeLoading, loaderKey, { root: true })
      )
  })

  return [draw]
}
