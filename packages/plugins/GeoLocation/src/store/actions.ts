import { PolarActionTree } from '@polar/lib-custom-types'
import { passesBoundaryCheck } from '@polar/lib-passes-boundary-check'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import { Vector } from 'ol/source'
import Feature from 'ol/Feature'
import { Style, Icon } from 'ol/style'
import * as Proj from 'ol/proj.js'
import Geolocation from 'ol/Geolocation.js'
import { transform as transformCoordinates } from 'ol/proj'
import Overlay from 'ol/Overlay'
import { GeoLocationState, GeoLocationGetters } from '../types'
import geoLocationMarker from '../assets/geoLocationMarker'
import { getTooltip } from '../utils/tooltip'

const actions: PolarActionTree<GeoLocationState, GeoLocationGetters> = {
  setupModule({ getters, commit, dispatch }): void {
    dispatch('addMarkerLayer')

    // NOTE: limited support across browsers
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        commit('setIsGeolocationDenied', true)
      }
    })
    if (getters.checkLocationInitially) {
      dispatch('track')
    }
    dispatch('setupTooltip')
  },
  setupTooltip({ getters, rootGetters }) {
    if (getters.showTooltip) {
      const { map } = rootGetters
      const overlay = new Overlay({
        element: getTooltip(),
        positioning: 'bottom-center',
        offset: [0, -5],
      })
      map.addOverlay(overlay)
      map.on('pointermove', ({ pixel, dragging }) => {
        if (dragging) {
          return
        }
        const features = map.getFeaturesAtPixel(pixel, {
          layerFilter: (layer) =>
            layer.get('name') === 'geoLocationMarkerLayer',
        })

        const coordinate = features.length
          ? map.getCoordinateFromPixel(pixel)
          : undefined
        overlay.setPosition(coordinate)
      })
    }
  },

  /** Enable tracking of geo position */
  track({ getters: { isGeolocationDenied, geolocation }, commit, dispatch }) {
    if (isGeolocationDenied === false) {
      if (geolocation === null) {
        geolocation = new Geolocation({
          tracking: true,
          projection: Proj.get('EPSG:4326') as Proj.Projection,
        })
        commit('setGeolocation', geolocation)
      } else {
        dispatch('positioning')
      }
      geolocation.on('change:position', () => dispatch('positioning'))
      geolocation.on('error', (error) => dispatch('onError', error))
      commit('setTracking', true)
    } else {
      dispatch('onError')
    }
  },

  /**
   * Stop tracking of geo position
   */
  untrack({ getters: { geolocation }, commit, dispatch }) {
    geolocation?.setTracking(false) // for FireFox - cannot handle geolocation.un(...)
    dispatch('removeMarker')
    commit('setTracking', false)
    commit('setGeolocation', null)
  },

  /**
   * Adds the geoLocationMarkerLayer to the map which also has a feature
   * called geoLocationMarker for visualising the geoLocation of a user.
   * Until the tracking is initiated the style of the layer will be null and
   * gets only changed when the addMarker function gets called.
   */
  addMarkerLayer({ rootGetters: { map } }) {
    const geoLocationMarkerLayer = new VectorLayer({
      source: new Vector({
        features: [
          new Feature({
            type: 'point',
            name: 'geoLocationMarker',
          }),
        ],
      }),
      style: null,
      properties: { name: 'geoLocationMarkerLayer' },
    })
    map.addLayer(geoLocationMarkerLayer)
    geoLocationMarkerLayer.setZIndex(Infinity)
  },

  /**
   * Setting the current map on the position
   */
  async positioning({
    rootGetters: { map },
    getters: {
      boundaryLayerId,
      boundaryOnError,
      geolocation,
      configuredEpsg,
      position,
    },
    commit,
    dispatch,
  }) {
    const transformedCoords = transformCoordinates(
      geolocation?.getPosition() as number[],
      Proj.get('EPSG:4326') as Proj.Projection,
      configuredEpsg
    )

    const boundaryCheckPassed = await passesBoundaryCheck(
      map,
      boundaryLayerId,
      transformedCoords
    )
    const boundaryErrorOccurred = typeof boundaryCheckPassed === 'symbol'

    if (
      boundaryCheckPassed === false ||
      (boundaryErrorOccurred && boundaryOnError !== 'permissive')
    ) {
      dispatch('printPositioningFailed', boundaryErrorOccurred)
      // if check initially breaks or user leaves boundary, turn off tracking
      dispatch('untrack')
      return
    }

    if (
      position[0] !== transformedCoords[0] ||
      position[1] !== transformedCoords[1]
    ) {
      commit('setPosition', transformedCoords)
      dispatch('addMarker', transformedCoords)
    }
  },
  printPositioningFailed(
    { dispatch, getters: { toastAction } },
    boundaryErrorOccurred
  ) {
    if (toastAction) {
      const toast = boundaryErrorOccurred
        ? {
            type: 'error',
            text: 'plugins.geoLocation.toast.boundaryError',
            timeout: 0,
          }
        : {
            type: 'info',
            text: 'plugins.geoLocation.toast.notInBoundary',
            timeout: 10000,
          }
      dispatch(toastAction, toast, { root: true })
    } else {
      // eslint-disable-next-line no-console
      console[boundaryErrorOccurred ? 'error' : 'log'](
        boundaryErrorOccurred
          ? 'Checking boundary layer failed.'
          : 'User position outside of boundary layer.'
      )
    }
  },

  /**
   * Adds a marker to the map, which indicates the users geoLocation.
   * This happens by applying a style to the geoLocationMarkerLayer and
   * a geometry to the geoLocationMarker.
   */
  addMarker(
    {
      getters: { geoLocationMarkerLayer, markerFeature, keepCentered },
      dispatch,
    },
    coordinates
  ) {
    const hadPosition = Boolean(markerFeature.getGeometry())

    markerFeature.setGeometry(new Point(coordinates))

    geoLocationMarkerLayer?.setStyle(
      new Style({
        image: new Icon({
          // TODO: It might be interesting to be able to change the color.
          src: `data:image/svg+xml;utf8,${geoLocationMarker}`,
          scale: 0.08,
          opacity: 1,
        }),
      })
    )

    if (keepCentered || !hadPosition) {
      dispatch('zoomAndCenter')
    }
  },

  /**
   * Removes the geoLocation marker from the map by setting style property
   * of the geoLocationMarkerLayer to null.
   */
  removeMarker({
    getters: { geoLocationMarkerLayer, markerFeature },
    commit,
  }): void {
    geoLocationMarkerLayer?.setStyle(null)
    markerFeature.setGeometry(undefined)
    commit('setPosition', [])
  },

  /**
   * Zooms to the configured zoomLevel and centers the map
   * according to a users coordinates
   */
  zoomAndCenter({ rootGetters, getters: { position, zoomLevel } }) {
    rootGetters.map.getView().setCenter(position)
    rootGetters.map.getView().setZoom(zoomLevel)
  },

  /**
   * Show error information and stop tracking if there are errors by tracking the position
   */
  onError({ commit, dispatch }, error) {
    dispatch(
      'plugin/toast/addToast',
      {
        type: 'error',
        text: 'common:plugins.geoLocation.button.tooltip.locationAccessDenied',
        timeout: 5000,
      },
      { root: true }
    )
    console.error(error.message)

    commit('setIsGeolocationDenied', true)
    commit('setTracking', false)
    dispatch('removeMarker')
  },
}

export default actions
