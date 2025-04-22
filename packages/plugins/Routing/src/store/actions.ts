import VectorSource from 'ol/source/Vector'
import { LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj'
import { RoutingState, RoutingGetters } from '../types'
import {
  fetchSearchData,
  createSearchUrl,
  processSearchResults,
} from '../utils/addressSearchUtils'
import {
  fetchRoutingDirections,
  transformCoordinateToWGS84,
} from '../utils/routingServiceUtils'
import createDrawLayer from '../utils/createDrawLayer'
import createDrawStyle from '../utils/createDrawStyle'

const drawSource = new VectorSource()
let drawLayer

const actions: PolarActionTree<RoutingState, RoutingGetters> = {
  /**
   * Initializes the tool by updating the state from mapConfig and by setting up the draw layer and click event listener.
   * @param context - VueX action context.
   * @param contextRootGetters - Global getters.
   * @param contextCommit - VueX commit function.
   * @param contextState - VueX state object.
   */
  initializeTool({ rootGetters: { map, configuration }, commit, state }) {
    /* setup drawLayer and click event listener */

    drawLayer = createDrawLayer(drawSource)
    map?.addLayer(drawLayer)
    map?.on('click', function (event) {
      const clickCoordinate = event.coordinate
      if (state.start.length === 0) {
        commit('setStart', clickCoordinate)
      } else if (
        state.end.length === 0 &&
        !state.start.every((v, i) => v === clickCoordinate[i]) // end Coordinate should not be the same as start Coordinate
      ) {
        commit('setEnd', clickCoordinate)
      }
    })

    commit('setDisplayPreferences', configuration?.routing?.displayPreferences)
    commit(
      'setDisplayRouteTypesToAvoid',
      configuration?.routing?.displayRouteTypesToAvoid
    )
    commit(
      'setAddressSearchUrl',
      configuration?.routing?.addressSearch.searchMethods[0].url
    )
  },

  /* ROUTING REQUEST */

  /**
   * Creates a routing service URL based on the selected travel mode.
   * @param context - VueX action context.
   * @param contextRootGetters - Global getters.
   * @param contextState - VueX state object.
   * @returns The constructed URL or undefined if no travel mode is selected.
   */
  createUrl({ rootGetters: { configuration }, state }) {
    if (state.selectedTravelMode !== '') {
      const url =
        configuration?.routing?.serviceUrl +
        state.selectedTravelMode +
        '/' +
        configuration?.routing?.format
      return url
    }
    console.error('No travel mode selected for URL creation')
  },
  // TODO: add tsDoc comment
  getTransformedCoordinates({ rootGetters: { configuration }, state }) {
    return [
      transformCoordinateToWGS84(state.start, configuration?.epsg),
      transformCoordinateToWGS84(state.end, configuration?.epsg),
    ]
  },
  // TODO: add tsDoc comment
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
   * Sends a routing request to the external service.
   * @param context - VueX action context.
   * @param contextCommit - VueX commit function.
   * @param contextDispatch - VueX dispatch function.
   * @param contextState - VueX state object.
   */
  async sendRequest({ commit, dispatch, state }) {
    try {
      const transformedCoordinates = await dispatch('getTransformedCoordinates')
      const url = await dispatch('createUrl')
      const response = await fetchRoutingDirections(
        url,
        transformedCoordinates,
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

  /* ADDRESS SEARCH */

  /**
   * Sends a search request for streets based on user input.
   * @param context - VueX action context.
   * @param contextCommit - VueX commit function.
   * @param contextRootGetters - Global getters.
   * @param contextDispatch - VueX dispatch function.
   * @param payload - Contains input search query.
   * @param payloadInput - The street name input.
   */
  async sendSearchRequest(
    { commit, rootGetters: { configuration }, state },
    { input }
  ) {
    if (
      !input ||
      input.length < configuration?.routing?.addressSearch.minLength
    ) {
      console.error('Input is too short or missing.')
      return
    }

    try {
      const addressSearchUrl = state.addressSearchUrl
      const storedQueryID = 'findeStrasse'
      const url = createSearchUrl(addressSearchUrl, storedQueryID, input)
      const responseText = await fetchSearchData(url)

      const features = await processSearchResults(
        responseText,
        addressSearchUrl
      )

      commit('setSearchResults', features)
    } catch (error) {
      console.error('Error in sendSearchRequest:', error)
    }
  },

  /* DRAW ROUTE ON MAP */

  /**
   * Adds features to the map.
   * @param context - VueX action context.
   * @param contextCommit - VueX commit function.
   * @param payload - Feature data.
   * @param payloadGeoJSON - GeoJSON data.
   * @param payloadOverwrite - Whether to clear previous features.
   */
  addFeatures({ commit }, { geoJSON, overwrite = false }) {
    const features = new GeoJSON().readFeatures(geoJSON).map((feature) => {
      return feature
    })

    if (overwrite) {
      drawSource.clear()
    }
    drawSource.addFeatures(features)
    commit('updateFeatures', drawSource)
  },
  /**
   * Draws the calculated route on the map.
   * @param context - VueX action context.
   * @param contextRootGetters - Global getters.
   * @param contextState - VueX state object.
   */
  drawRoute({ rootGetters: { configuration }, state }) {
    const transformedCoordinates =
      state.routingResponseData?.features[0].geometry.coordinates.map(
        (coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:25832')
      )
    const routeLineString = new LineString(transformedCoordinates)

    const routeFeature = new Feature({
      geometry: routeLineString,
    })
    routeFeature.setStyle(
      createDrawStyle(
        configuration?.routing?.routeStyle?.stroke?.color,
        configuration?.routing?.routeStyle
      )
    )
    drawSource.addFeature(routeFeature)
  },

  /* RESET */

  /**
   * Deletes the current route drawing from the map.
   */
  deleteRouteDrawing() {
    drawSource.clear()
  },
  /**
   * Resets the selected coordinates and search settings.
   * @param context - VueX action context.
   * @param contextCommit - VueX commit function.
   * @param contextDispatch - VueX dispatch function.
   * @param contextState - VueX state object.
   */
  resetCoordinates({ commit, dispatch }) {
    commit('setStart', [])
    commit('setEnd', [])
    commit('setStartAddress', '')
    commit('setEndAddress', '')
    commit('setSelectedTravelMode', '')
    commit('setSelectedPreference', '')
    commit('setSelectedRouteTypesToAvoid', [])
    commit('setRoutingResponseData', {})
    dispatch('deleteRouteDrawing')
  },
}

export default actions
