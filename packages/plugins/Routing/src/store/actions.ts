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
  resetCoordinates({ commit }) {
    // TODO: Fehler beheben: "unknown local mutation type: resetCoordinates"
    commit('route/setRoute', [0.0, 0.0])
  },
  drawRoute({ rootGetters: { configuration }, state }, coordinates) {
    const transformedCoordinates = state.coordinates.map((coordinate) =>
      transform(coordinate, 'EPSG:4326', 'EPSG:25832')
    )
    console.error(transformedCoordinates)
    const routeLineString = new LineString(transformedCoordinates)

    const routeFeature = new Feature({
      geometry: routeLineString,
      featureProjection: 'EPSG:25832',
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
  sendRequest() {
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
              coordinates: this.startAndEndCoordinates,
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
        console.log('Response:', data)
        this.commit('setSearchResponseData', data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchDirections()
    drawRoute(data)
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
