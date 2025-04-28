import { type PolarActionTree } from '@polar/lib-custom-types'
import Feature from 'ol/Feature'
import { LineString, Point } from 'ol/geom'
import Draw from 'ol/interaction/Draw'
import VectorLayer from 'ol/layer/Vector'
import { transform } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import { Stroke, Style } from 'ol/style'
import { RoutingState, RoutingGetters } from '../types'
import { fetchRoutingDirections } from '../utils/routingServiceUtils'

const routeSource = new VectorSource()
let routeLayer
let draw: Draw

const actions: PolarActionTree<RoutingState, RoutingGetters> = {
  /**
   * Initializes the tool by updating the state from mapConfig and by setting up the draw layer and click event listener.
   */
  setupModule({ rootGetters, getters: { configuration }, commit, dispatch }) {
    routeLayer = new VectorLayer({
      source: routeSource,
      style: new Style({
        stroke: new Stroke({ color: 'blue', width: 6 }),
      }),
    })
    rootGetters.map.addLayer(routeLayer)

    dispatch('initializeDraw')

    commit('setDisplayPreferences', configuration.displayPreferences)
    commit(
      'setDisplayRouteTypesToAvoid',
      configuration.displayRouteTypesToAvoid
    )
  },
  initializeDraw({ commit }) {
    draw = new Draw({ stopClick: true, type: 'Point' })
    // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
    draw._isRoutingDraw = true
    draw.on('drawend', (e) => {
      commit(
        'addCoordinateToRoute',
        (e.feature.getGeometry() as Point).getCoordinates()
      )
      // @ts-expect-error | internal hack to detect it in @polar/plugin-pins and @polar/plugin-gfi
      draw._isRoutingDraw = false
    })
  },
  setCurrentlyFocusedInput({ commit, getters, rootGetters }, index: number) {
    const previousIndex = getters.currentlyFocusedInput
    commit('setCurrentlyFocusedInput', index)
    if (previousIndex === -1 && index !== -1) {
      rootGetters.map.addInteraction(draw)
    } else if (previousIndex !== -1 && index === -1) {
      rootGetters.map.removeInteraction(draw)
    }
  },
  async search({ dispatch, getters }, input: string) {
    if (getters.searchConfiguration) {
      await dispatch(getters.searchConfiguration.method, input, { root: true })
      // TODO: Await above and then check for 'featuresAvailable' and if true, then add 'searchResults' to results in UI here
    }
  },
  handleErrors({ dispatch }, error) {
    let errorMessage = ''
    if (error instanceof Error) {
      errorMessage = error.message
      console.error(error.message)
    } else {
      console.error('Unexpected error', error)
    }
    dispatch(
      'plugin/toast/addToast',
      {
        type: 'error',
        text: errorMessage,
      },
      { root: true }
    )
  },
  /**
   * Sends a routing request to the configured service.
   */
  async getRoute({ commit, dispatch, state, getters }) {
    dispatch('clearRoute')
    try {
      const response = await fetchRoutingDirections(
        getters.url,
        getters.routeAsWGS84,
        state.selectedRouteTypesToAvoid,
        state.selectedPreference
      )
      const data = await response.json()
      commit('setRoutingResponseData', data)
      dispatch('drawRoute')
    } catch (error) {
      dispatch('handleErrors', error)
    }
  },

  /* DRAW ROUTE ON MAP */

  /**
   * Draws the calculated route on the map.
   */
  drawRoute({ getters }) {
    const transformedCoordinates =
      // TODO: This seems to specific
      getters.routingResponseData?.features[0].geometry.coordinates.map(
        (coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:25832')
      )
    const routeLineString = new LineString(transformedCoordinates)

    const routeFeature = new Feature({
      geometry: routeLineString,
    })
    routeSource.addFeature(routeFeature)
  },
  /**
   * Deletes the current route drawing from the map.
   */
  clearRoute() {
    routeSource.clear()
  },
  /**
   * Resets the selected coordinates and search settings.
   */
  reset({ commit, dispatch }) {
    commit('resetRoute')
    commit('setCurrentlyFocusedInput', -1)
    commit('setSelectedTravelMode', '')
    commit('setSelectedPreference', '')
    commit('setSelectedRouteTypesToAvoid', [])
    commit('setRoutingResponseData', {})
    dispatch('clearRoute')
  },
}

export default actions
