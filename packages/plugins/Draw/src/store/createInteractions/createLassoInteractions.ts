import { rawLayerList } from '@masterportal/masterportalapi'
import { PolarActionContext } from '@polar/lib-custom-types'
import {
  getVectorFeaturesByFeatureRequest,
  parseWfsResponse,
} from '@polar/lib-get-features'
import { booleanContains } from '@turf/boolean-contains'
import {
  Feature as GeoJsonFeature,
  FeatureCollection,
  Geometry,
  GeometryCollection,
} from 'geojson'
import i18next from 'i18next'
import { Feature } from 'ol'
import { GeoJSON } from 'ol/format'
import { Polygon } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import { DrawGetters, DrawState } from '../../types'

let loaderKeyCounter = 0
const loaderKeyBase = 'draw-lasso-load'

const requestError = `@polar/plugin-draw: An error occurred on creating the lasso request: `
const rejectedError =
  '@polar/plugin-draw: The response to a lasso request indicated an error.'
const parseError =
  '@polar/plugin-draw: Client failure in reading responses in lasso action.'
const internalError = () => ({
  type: 'error',
  text: i18next.t('plugins.draw.lasso.internalError'),
})

const buildAddFeaturesPayload = (
  featureCollections: FeatureCollection[],
  drawnLasso: Feature
) => {
  const drawnLassoGeoJson = JSON.parse(new GeoJSON().writeFeature(drawnLasso))

  return {
    geoJSON: {
      type: 'FeatureCollection',
      features: featureCollections
        .reduce(
          (accumulator, { features }) => accumulator.concat(features),
          [] as GeoJsonFeature[]
        )
        .filter((feature) => {
          if (feature.geometry.type.startsWith('Multi')) {
            return (
              // since .type on GeometryCollection doesn't start with 'Multi'
              (
                feature.geometry as Exclude<Geometry, GeometryCollection>
              ).coordinates.every((partialCoordinates) =>
                booleanContains(drawnLassoGeoJson, {
                  type: 'Feature',
                  geometry: {
                    type: feature.geometry.type.slice(5), // un«Multi»ed
                    coordinates: partialCoordinates,
                  },
                  properties: {},
                })
              )
            )
          }
          return booleanContains(drawnLassoGeoJson, feature)
        }),
    },
  }
}

export default function ({
  rootGetters,
  getters,
  commit,
  dispatch,
}: PolarActionContext<DrawState, DrawGetters>) {
  const draw = new Draw({ type: 'Polygon', freehand: true })

  draw.on('drawend', (e) => {
    const toast = (toastObject) =>
      getters.toastAction &&
      dispatch(getters.toastAction, toastObject, { root: true })
    const drawnLasso = e.feature as Feature<Polygon> // due to Draw 'type' param
    const requests = getters.activeLassoIds.reduce((accumulator, id) => {
      try {
        const request = getVectorFeaturesByFeatureRequest({
          feature: drawnLasso,
          fetchLayerId: id,
          projectionCode: rootGetters.map.getView().getProjection().getCode(),
        })
        accumulator.push(request)
      } catch (e) {
        console.error(requestError, e)
        toast(internalError())
      }
      return accumulator
    }, [] as Promise<Response>[])

    let loaderKey
    if (getters.configuration.addLoading) {
      loaderKey = `${loaderKeyBase}-${loaderKeyCounter++}`
      commit(getters.configuration.addLoading, loaderKey, { root: true })
    }

    Promise.allSettled(requests)
      .then((settledRequests) =>
        Promise.all(
          (
            settledRequests.filter((promiseSettledResult, index) => {
              if (promiseSettledResult.status === 'rejected') {
                console.error(rejectedError, promiseSettledResult.reason)
                toast({
                  type: 'error',
                  text: i18next.t('plugins.draw.lasso.layerRejected', {
                    id: getters.activeLassoIds[index],
                  }),
                })
                return false
              }
              return true
            }) as PromiseFulfilledResult<Response>[]
          ).map(async (result, index) =>
            rawLayerList.getLayerWhere({ id: getters.activeLassoIds[index] })
              .typ === 'WFS'
              ? await parseWfsResponse(result.value, undefined, false)
              : ((await result.value.json()) as FeatureCollection)
          )
        )
      )
      .then((featureCollections) =>
        dispatch(
          'addFeatures',
          buildAddFeaturesPayload(featureCollections, drawnLasso)
        )
      )
      .catch((error) => {
        console.error(parseError, error)
        toast(internalError())
      })
      .finally(
        () =>
          getters.configuration.removeLoading &&
          commit(getters.configuration.removeLoading, loaderKey, { root: true })
      )
  })

  return [draw]
}
