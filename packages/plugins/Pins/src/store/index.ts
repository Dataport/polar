import { generateSimpleMutations } from '@repositoryname/vuex-generators'
import { passesBoundaryCheck } from '@polar/lib-passes-boundary-check'
import VectorLayer from 'ol/layer/Vector'
import Point from 'ol/geom/Point'
import { Vector } from 'ol/source'
import Feature from 'ol/Feature'
import { Draw, Modify, Select, Translate } from 'ol/interaction'
import { PinsConfiguration, PolarModule } from '@polar/lib-custom-types'
import { toLonLat, transform } from 'ol/proj'
import { pointerMove } from 'ol/events/condition'
import { Coordinate } from 'ol/coordinate'
import { PinsState, PinsGetters } from '../types'
import getPointCoordinate from '../util/getPointCoordinate'
import { getPinStyle } from '../util/getPinStyle'
import { getInitialState } from './state'
import getters from './getters'

export const makeStoreModule = () => {
  let pinsLayer: VectorLayer
  const move = new Select({
    layers: (l) => l === pinsLayer,
    style: null,
    condition: pointerMove,
  })

  const storeModule: PolarModule<PinsState, PinsGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ rootGetters, dispatch }): void {
        dispatch('setupClickInteraction')
        dispatch('setupCoordinateSource')
        rootGetters.map.addInteraction(move)
        move.on('select', ({ selected }) => {
          const { movable } = rootGetters.configuration.pins || {}
          if (movable === 'none') {
            document.body.style.cursor = selected.length ? 'not-allowed' : ''
          }
        })
        dispatch('setupInitial')
        // without update, map will pan during drag
        this.watch(
          () => rootGetters.hasSmallWidth || rootGetters.hasSmallHeight,
          () => dispatch('updateMarkerDraggability')
        )
      },
      setupClickInteraction({ rootGetters, getters, commit, dispatch }): void {
        const { appearOnClick, movable } = rootGetters.configuration.pins || {}
        const interactions = rootGetters.map.getInteractions()
        const showPin = appearOnClick === undefined ? true : appearOnClick.show
        rootGetters.map.on('singleclick', async ({ coordinate }) => {
          const isDrawing = interactions.getArray().some(
            (interaction) =>
              (interaction instanceof Draw &&
                // @ts-expect-error | internal hack to detect it from @polar/plugin-gfi
                (interaction._isMultiSelect ||
                  // @ts-expect-error | internal hack to detect it from @polar/plugin-routing
                  interaction._isRoutingDraw ||
                  // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
                  interaction._isDrawPlugin)) ||
              interaction instanceof Modify ||
              // @ts-expect-error | internal hack to detect it from @polar/plugin-draw
              interaction._isDeleteSelect
          )
          if (
            (movable === 'drag' || movable === 'click') &&
            showPin &&
            // NOTE: It is assumed that getZoom actually returns the currentZoomLevel, thus the view has a constraint in the resolution.
            (rootGetters.map.getView().getZoom() as number) >=
              getters.atZoomLevel &&
            !isDrawing &&
            (await dispatch('isCoordinateInBoundaryLayer', coordinate))
          ) {
            const payload = { coordinates: coordinate, clicked: true }
            dispatch('showMarker', payload)
            commit('setCoordinatesAfterDrag', coordinate)
            dispatch('updateCoordinates', coordinate)
          }
        })
      },
      setupCoordinateSource({ rootGetters, dispatch }): void {
        const { coordinateSource } = rootGetters.configuration.pins || {}
        if (coordinateSource) {
          // redo marker if source (e.g. from addressSearch) changes
          this.watch(
            () => rootGetters[coordinateSource],
            (feature) => {
              // NOTE: 'reverse_geocoded' is set as type on reverse geocoded features to prevent infinite loops
              // as in: ReverseGeocode->AddressSearch->Pins->ReverseGeocode.
              if (feature && feature.type !== 'reverse_geocoded') {
                const payload = {
                  coordinates: feature.geometry.coordinates,
                  type: feature.geometry.type,
                  clicked: false,
                  epsg: feature.epsg,
                }
                dispatch('showMarker', payload)
              }
            },
            { deep: true }
          )
        }
      },
      setupInitial({ rootGetters, getters, dispatch, commit }): void {
        const { initial } = rootGetters.configuration.pins as PinsConfiguration
        if (initial) {
          const { coordinates, centerOn, epsg } = initial
          const transformedCoordinates =
            typeof epsg === 'string'
              ? transform(coordinates, epsg, rootGetters.configuration.epsg)
              : coordinates
          dispatch('showMarker', {
            coordinates: transformedCoordinates,
            clicked: true,
          })
          commit('setCoordinatesAfterDrag', transformedCoordinates)
          dispatch('updateCoordinates', transformedCoordinates)
          if (centerOn) {
            rootGetters.map.getView().setCenter(getters.transformedCoordinate)
            rootGetters.map.getView().setZoom(getters.toZoomLevel)
          }
        }
      },
      /**
       * Builds a vectorLayer which contains the mapMarker as
       * a vectorFeature and adds it to the map.
       * @param payload - an object with a boolean that shows if the coordinate
       * was submitted via click and the corresponding coordinates.
       */
      showMarker({ getters, rootGetters, dispatch }, payload): void {
        // always clean up other/old markers first – single marker only atm
        dispatch('removeMarker')
        const { configuration, map } = rootGetters
        if (payload.clicked === false) {
          dispatch(
            'updateCoordinates',
            getPointCoordinate(
              payload.epsg,
              configuration.epsg,
              payload.type,
              payload.coordinates
            )
          )
          map.getView().setCenter(getters.transformedCoordinate)
          map.getView().setZoom(getters.toZoomLevel)
        }
        const coordinatesForIcon =
          payload.clicked === true
            ? payload.coordinates
            : getters.transformedCoordinate
        map.removeLayer(pinsLayer)
        pinsLayer = new VectorLayer({
          source: new Vector({
            features: [
              new Feature({
                geometry: new Point(coordinatesForIcon),
                type: 'point',
                name: 'mapMarker',
                zIndex: 100,
              }),
            ],
          }),
          style: getPinStyle(configuration?.pins?.style || {}),
        })
        pinsLayer.set('polarInternalId', 'mapMarkerVectorLayer')
        map.addLayer(pinsLayer)
        pinsLayer.setZIndex(100)
        dispatch('updateMarkerDraggability')
      },
      // Decides whether to make the mapMarker draggable and, if so, does so.
      updateMarkerDraggability({
        rootGetters: { map, configuration },
        getters,
        commit,
        dispatch,
      }): void {
        const movable = configuration.pins?.movable
        if (movable !== 'drag') {
          return
        }
        const { atZoomLevel } = getters
        const previousTranslate = map
          .getInteractions()
          .getArray()
          .find((interaction) => interaction.get('_polar_plugin_pins'))
        const translate = new Translate({
          condition: () => (map.getView().getZoom() as number) >= atZoomLevel,
          layers: [pinsLayer],
        })
        translate.set('_polar_plugin_pins', true)
        if (previousTranslate) {
          map.removeInteraction(previousTranslate)
        }
        map.addInteraction(translate)
        translate.on('translatestart', () => {
          commit('setGetsDragged', true)
        })
        translate.on('translateend', (evt) => {
          commit('setGetsDragged', false)
          evt.features.forEach(async (feat) => {
            const geometry = feat.getGeometry()
            // @ts-expect-error | abstract method missing on type, exists in all implementations
            let coordinates = geometry?.getCoordinates()
            if (!(await dispatch('isCoordinateInBoundaryLayer', coordinates))) {
              coordinates = getters.transformedCoordinate
              dispatch('showMarker', {
                coordinates,
                clicked: true,
              })
            }
            commit('setCoordinatesAfterDrag', coordinates)
            dispatch('updateCoordinates', coordinates)
          })
        })
      },
      // Removes the mapMarker from the map by removing its vectorLayer
      removeMarker({ rootGetters: { map } }): void {
        map.getLayers().forEach(function (layer) {
          if (layer?.get?.('polarInternalId') === 'mapMarkerVectorLayer') {
            map.removeLayer(layer)
          }
        })
      },
      /**
       * Set the value for the transformed coordinate and save it as latLon as well.
       * @param coordinates - Coordinates of the pin.
       */
      updateCoordinates({ commit, rootGetters }, coordinates: Coordinate) {
        const lonLat = toLonLat(coordinates, rootGetters.configuration.epsg)
        const latLon = [lonLat[1], lonLat[0]]
        commit('setTransformedCoordinate', coordinates)
        commit('setLatLon', latLon)
      },
      /**
       * Checks if boundary layer conditions are met; returns false if not and
       * toasts to the user about why the action was blocked, if `toastAction` is
       * configured. If no boundaryLayer configured, always returns true.
       */
      async isCoordinateInBoundaryLayer(
        { rootGetters, dispatch },
        coordinates: Coordinate
      ): Promise<boolean> {
        const { boundaryLayerId, toastAction, boundaryOnError } =
          rootGetters.configuration?.pins || {}
        const boundaryCheckResult = await passesBoundaryCheck(
          rootGetters.map,
          boundaryLayerId,
          coordinates
        )
        if (
          !boundaryLayerId ||
          // if a setup error occurred, client will act as if no boundaryLayerId specified
          boundaryCheckResult === true ||
          (typeof boundaryCheckResult === 'symbol' &&
            boundaryOnError !== 'strict')
        ) {
          return true
        }
        const errorOccurred = typeof boundaryCheckResult === 'symbol'
        if (toastAction) {
          const toast = errorOccurred
            ? { type: 'error', text: 'plugins.pins.toast.boundaryError' }
            : {
                type: 'info',
                text: 'plugins.pins.toast.notInBoundary',
                timeout: 10000,
              }
          dispatch(toastAction, toast, { root: true })
        } else {
          // eslint-disable-next-line no-console
          console[errorOccurred ? 'error' : 'log'](
            errorOccurred
              ? 'Checking boundary layer failed.'
              : ['Pin position outside of boundary layer:', coordinates]
          )
        }
        return false
      },
    },
    mutations: { ...generateSimpleMutations(getInitialState()) },
    getters,
  }
  return storeModule
}
