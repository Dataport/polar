import VectorSource from 'ol/source/Vector'
import { LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj'
import { RoutingState, RoutingGetters } from '../types'
import createDrawLayer from '../utils/createDrawLayer'
import createDrawStyle from '../utils/createDrawStyle'

const drawSource = new VectorSource()
let drawLayer

const actions: PolarActionTree<RoutingState, RoutingGetters> = {
  setupModule({ rootGetters: { configuration, map }, dispatch }) {
    console.error(configuration)
    dispatch('initializeConfigStyle')
    drawLayer = createDrawLayer(drawSource)
    map.addLayer(drawLayer)
    console.error(map.getLayers().getArray())
  },
  resetCoordinates({ commit, state }) {
    // TODO: Fehler beheben: "unknown local mutation type: resetCoordinates"
    commit('setStart', [0.0, ''])
    commit('setEnd', [0.0, ''])
    console.error(
      'Start- und Endpunkt im Store nach reset:',
      state.start,
      state.end
    )
  },
  sendRequest({ commit, dispatch }) {
    const searchCoordinates = [[10.011687335562508, 53.553460000125064], [10.00032456432135, 53.54922700402619]]
    const fetchDirections = async () => {
      try {
        const response = await fetch(
          'https://geodienste.hamburg.de/web_ors/v2/directions/driving-car/geojson',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: searchCoordinates,
              geometry: true,
              instructions: true,
              language: 'en',
              options: {
                avoid_polygons: {
                  coordinates: [],
                  type: 'MultiPolygon',
                },
              },
              preference: 'recommended',
              units: 'm',
            }),
          }
        )
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        console.error('Response:', data)
        commit('setSearchResponseData', data)
        dispatch('drawRoute')
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchDirections()
  },
  drawRoute({ rootGetters: { configuration }, state }) {
    console.error(`stored response: `, state.searchResponseData)
    const transformedCoordinates =
      state.searchResponseData.features[0].geometry.coordinates.map((coordinate) =>
      transform(coordinate, 'EPSG:4326', 'EPSG:25832')
    )
    console.error(
      `coordinates transformed for drawing purpose: `,
      transformedCoordinates
    )
    const routeLineString = new LineString(transformedCoordinates)

    const routeFeature = new Feature({
      geometry: routeLineString,
    })
    routeFeature.setStyle(
      createDrawStyle(
        configuration?.routing?.style?.stroke?.color,
        configuration?.routing?.style
      )
    )
    drawSource.addFeature(routeFeature)
    console.error(drawSource.getFeatures())
  },
  checkConfig({ rootGetters: { configuration }, commit }) {
    if (configuration?.routing?.selectableTravelModes) {
      commit(
        'setSelectableTravelModes',
        configuration?.routing?.selectableTravelModes
      )
    }
    if (configuration?.routing?.selectablePreferences) {
      commit(
        'setSelectablePreferences',
        configuration?.routing?.selectablePreferences
      )
    }
    configuration?.routing?.displayPreferences
      ? commit('setDisplayPreferences', true)
      : commit('setDisplayPreferences', false)
    configuration?.routing?.displayRouteTypesToAvoid
      ? commit('setDisplayPreferences', true)
      : commit('setDisplayPreferences', false)
  },
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
  initializeConfigStyle: ({ commit, getters: { routingConfiguration } }) => {
    if (routingConfiguration?.style?.stroke?.color) {
      commit('setSelectedStrokeColor', routingConfiguration.style.stroke.color)
    }
  },
}

export default actions
