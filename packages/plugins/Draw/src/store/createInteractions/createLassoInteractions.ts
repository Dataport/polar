import Draw from 'ol/interaction/Draw'
import Interaction from 'ol/interaction/Interaction'
import i18next from 'i18next'
import { rawLayerList } from '@masterportal/masterportalapi'
import { PolarActionContext } from '@polar/lib-custom-types'
import { DrawGetters, DrawState } from '../../types'

const loaderKey = 'drawLasso'

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

// TODO un – refactor after done
// eslint-disable-next-line max-lines-per-function
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
  // TODO un
  // eslint-disable-next-line max-lines-per-function
  draw.on('drawend', (e) => {
    dispatch('setMode', 'none')

    const drawnLasso = e.feature
    const lassos = rootGetters.configuration.draw?.lassos || []
    const toastAction = rootGetters.configuration.draw?.toastAction || ''
    const promises = lassos.reduce((accumulator, { id, minZoom = true }) => {
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
          dispatch(toastAction, {
            type: 'info',
            text: i18next.t('plugins.draw.lasso.notInZoomRange', {
              serviceName: layerConfig.name || id,
            }),
            timeout: 10000,
          })
        } else {
          console.warn(
            `Lasso not used with layer with id "${id}". (minZoom not reached)`
          )
        }
        return accumulator
      }
      const serviceDefinition = rawLayerList.getLayerWhere({ id })

      // TODO implement for OAF, use existing getFeatures for WFS
      // https://api.hamburg.de/datasets/v1/alkis_vereinfacht/collections/Flurstueck/items?f=json&limit=10&bbox=10.0872,53.5357,10.0883,53.5362

      accumulator.push(new Promise(() => ({})))
      return accumulator
    }, [] as Promise<object>[])

    Promise.all(promises)
      .then((resolutions) => {
        if (addLoading) {
          commit(addLoading, loaderKey, { root: true })
        }

        // TODO parse resolutions
        // TODO filter with drawnLasso (we're probably just loading by bbox?)
        // TODO add as geoJSON to draw

        console.warn(resolutions)

        dispatch('addFeatures', { geoJSON: {} })
      })
      .catch(() => {
        /* TODO at least toast something */
      })
      .finally(
        () => removeLoading && commit(removeLoading, loaderKey, { root: true })
      )
  })

  return [draw]
}
