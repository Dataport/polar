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
  initializeTool({
    rootGetters: { configuration, map },
    dispatch,
    commit,
    state,
  }) {
    dispatch('initializeConfigStyle') // testen
    drawLayer = createDrawLayer(drawSource)
    map?.addLayer(drawLayer) // testen, ob es passiert ist
    map?.on('click', function (event) {
      const formattedCoordinate = event.coordinate

      // prüfen, ob im state schon startAddress vorhanden ist - falls ja, die neue Koordinate als endAddress speichern
      if (state.start.length === 0) {
        commit('setStart', formattedCoordinate) // wurde setStart als commit aufgerufen und meine formatierte Coordinate reingeschrieben? Im State überprüfen
      } else if (state.end.length === 0) {
        commit('setEnd', formattedCoordinate)
      }
    })
  },
  // limitNumberWithinRange(value) {
  //   const MIN = 1
  //   const MAX = 20
  //   const parsed = parseInt(value)
  //   return Math.min(Math.max(parsed, MIN), MAX)
  // },
  translateCoordinateToWGS84({ rootGetters: { configuration } }, Coordinate) {
    const wgs84Coordinate = transform(
      Coordinate,
      configuration?.epsg,
      'EPSG:4326'
    )
    return wgs84Coordinate
  },
  resetCoordinates({ commit, state }) {
    // TODO: Fehler beheben: "unknown local mutation type: resetCoordinates"
    commit('setStart', [])
    commit('setEnd', [])
  },
  createUrl({ rootGetters: { configuration }, state }) {
    // TODO: Travel-Modes mit Switch Case (?) in finale Form bringen o. bessere Lösung finden
    const url =
      configuration?.routing?.serviceUrl +
      state.selectedTravelMode +
      '/' +
      configuration?.routing?.format

    return url
  },
  async sendRequest({ commit, dispatch, state }) {
    const searchCoordinates = [
      await dispatch('translateCoordinateToWGS84', state.start),
      await dispatch('translateCoordinateToWGS84', state.end),
    ]
    const url = await dispatch('createUrl')

    // Direkt auf die verschachtelte Funktion warten
    try {
      const response = await fetch(url, {
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
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      commit('setSearchResponseData', data)
      dispatch('drawRoute')
    } catch (error) {
      console.error('Error:', error)
    }
  },
  createSearchUrl(searchInput) {
    const url =
      'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0&StoredQuery_ID=findeStrasse&strassenname=' +
      searchInput
    return url
  },
  async sendSearchRequest({ dispatch, state }, searchInput) {
    const url = dispatch('createSearchUrl', searchInput)
    if (searchInput.length >= state.minLength) {
      try {
        const response = await fetch(url, {
          method: 'GET',
        })
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
      } catch (error) {
        console.error('send Search Error', error)
      }
    }
  },
  drawRoute({ rootGetters: { configuration }, state }) {
    if (!state.searchResponseData?.features?.length) {
      console.error('No features available for drawing')
      return
    }

    const transformedCoordinates =
      state.searchResponseData.features[0].geometry.coordinates.map(
        (coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:25832')
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
    if (!geoJSON || !geoJSON.features?.length) {
      console.error('Invalid geoJSON data')
      return
    }

    const features = new GeoJSON().readFeatures(geoJSON)
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
