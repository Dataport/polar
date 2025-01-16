/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
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

    dispatch('initializeConfigStyle')
    drawLayer = createDrawLayer(drawSource)
    map?.addLayer(drawLayer)

    map?.on('click', (event) => {
      const formattedCoordinate = event.coordinate

      if (!state.start.length) {
        commit('setStart', formattedCoordinate)
      } else if (!state.end.length) {
        commit('setEnd', formattedCoordinate)
      }
    })
  },

  translateCoordinateToWGS84({ rootGetters: { configuration } }, coordinate) {
    return transform(coordinate, configuration?.epsg, 'EPSG:4326')
  },

  resetCoordinates({ commit }) {
    commit('setStart', [])
    commit('setEnd', [])
  },

  createUrl({ rootGetters: { configuration }, state }) {
    return `${configuration?.routing?.serviceUrl}${state.selectedTravelMode}/${configuration?.routing?.format}`
  },

  async sendRequest({ commit, dispatch, state }) {
    try {
      const searchCoordinates = [
        await dispatch('translateCoordinateToWGS84', state.start),
        await dispatch('translateCoordinateToWGS84', state.end),
      ]
      const url = await dispatch('createUrl')

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coordinates: searchCoordinates,
          geometry: true,
          instructions: true,
          language: 'en',
          options: {
            avoid_polygons: { coordinates: [], type: 'MultiPolygon' },
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
      console.error('Error in sendRequest:', error)
    }
  },

  async fetchHausnummern(
    { rootGetters: { configuration }, dispatch },
    strassenname
  ) {
    const searchMethod = configuration.routing.addressSearch.searchMethods[0]

    if (!strassenname) {
      console.error('Strassenname ist leer.')
      return
    }

    const storedQueryID = 'HausnummernZuStrasse'
    const url = `${searchMethod.url}&${new URLSearchParams({
      service: 'WFS',
      request: 'GetFeature',
      version: '2.0.0',
      StoredQuery_ID: storedQueryID,
      strassenname,
    })}`

    try {
      const response = await fetch(url, { method: 'GET' })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const text = await response.text()
      const data = await dispatch('parseResponseHausnummern', text)
      return data.features
    } catch (error) {
      console.error('Error in fetchHausnummern:', error)
      return []
    }
  },

  parseResponseHausnummern({}, responseText) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(responseText, 'application/xml')
      const members = xmlDoc.getElementsByTagName('wfs:member')
      const features = []

      for (let i = 0; i < members.length; i++) {
        const member = members[i]
        const hauskoordinaten = member.getElementsByTagName(
          'gages:Hauskoordinaten'
        )[0]

        if (hauskoordinaten) {
          const hausnummer =
            hauskoordinaten.getElementsByTagName('dog:hausnummer')[0]
              ?.textContent || ''
          const hausnummerZusatz =
            hauskoordinaten.getElementsByTagName('dog:hausnummernzusatz')[0]
              ?.textContent || ''

          const geographicIdentifier =
            hauskoordinaten.getElementsByTagName(
              'iso19112:geographicIdentifier'
            )[0]?.textContent || ''

          const positionElement =
            hauskoordinaten.getElementsByTagName('gml:pos')[0]
          const position =
            positionElement?.textContent.split(' ').map(Number) || []

          const polygonElement =
            hauskoordinaten.getElementsByTagName('gml:posList')[0]
          const boundingPolygon =
            polygonElement?.textContent.split(' ').map(Number) || []

          features.push({
            hausnummer,
            hausnummerZusatz,
            geographicIdentifier,
            position,
            boundingPolygon,
          })
        }
      }

      console.log('Parsed house numbers:', features)
      return { features }
    } catch (error) {
      console.error('Error parsing house numbers response:', error)
      return { features: [] }
    }
  },

  async sendSearchRequest(
    { state, commit, rootGetters: { configuration }, dispatch },
    { input }
  ) {
    const config = configuration.routing.addressSearch
    const searchMethod = config.searchMethods[0]

    if (!input || input.length < config.minLength) {
      console.error('Input is too short or missing.')
      return
    }

    const storedQueryID = 'findeStrasse'
    const urlParams = {
      service: 'WFS',
      request: 'GetFeature',
      version: '2.0.0',
      StoredQuery_ID: storedQueryID,
      strassenname: input,
    }

    const url = `${searchMethod.url}&${new URLSearchParams(urlParams)}`

    try {
      const response = await fetch(url, { method: 'GET' })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const text = await response.text()
      const streetData = await dispatch('parseResponse', text)

      const features = streetData.features || []

      for (const feature of features) {
        const hausnummern = await dispatch(
          'fetchHausnummern',
          feature.strassenname
        )
        feature.hausnummern = hausnummern.map((item) => item.hausnummer)
      }

      commit('setSearchResults', features)
      console.log('Final search results with house numbers:', features)
    } catch (error) {
      console.error('Error in sendSearchRequest:', error)
    }
  },

  async parseResponse({}, responseText) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(responseText, 'application/xml')

      const members = xmlDoc.getElementsByTagName('wfs:member')
      const features = []

      for (let i = 0; i < members.length; i++) {
        const member = members[i]
        const strasseElement = member.getElementsByTagName('dog:Strassen')[0]

        if (strasseElement) {
          const strassenname =
            strasseElement.getElementsByTagName('dog:strassenname')[0]
              ?.textContent || 'Unbekannt'

          const ortsteilname =
            strasseElement.getElementsByTagName('dog:ortsteilname')[0]
              ?.textContent || 'Unbekannt'

          const position =
            strasseElement.getElementsByTagName('gml:pos')[0]?.textContent ||
            null

          const boundingPolygon =
            strasseElement.getElementsByTagName('gml:posList')[0]
              ?.textContent || null

          const hausnummern = []
          const hausnummerElements =
            strasseElement.getElementsByTagName('dog:hausnummer')
          for (let j = 0; j < hausnummerElements.length; j++) {
            hausnummern.push(hausnummerElements[j].textContent)
          }

          features.push({
            strassenname,
            ortsteilname,
            position: position
              ? position.split(' ').map((coord) => parseFloat(coord))
              : null,
            boundingPolygon: boundingPolygon
              ? boundingPolygon.split(' ').map((coord) => parseFloat(coord))
              : null,
            hausnummern,
          })
        }
      }

      console.log('Extracted features:', features)
      return { features }
    } catch (error) {
      console.error('Error parsing response:', error)
      return { features: [] }
    }
  },
  drawRoute({ rootGetters: { configuration }, state }) {
    if (!state.searchResponseData?.features?.length) {
      console.error('No features available for drawing.')
      return
    }

    const transformedCoordinates =
      state.searchResponseData.features[0].geometry.coordinates.map(
        (coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:25832')
      )
    const routeLineString = new LineString(transformedCoordinates)

    const routeFeature = new Feature({ geometry: routeLineString })
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
        configuration.routing.selectableTravelModes
      )
    }
    if (configuration?.routing?.selectablePreferences) {
      commit(
        'setSelectablePreferences',
        configuration.routing.selectablePreferences
      )
    }

    commit(
      'setDisplayPreferences',
      !!configuration?.routing?.displayPreferences
    )
    commit(
      'setDisplayRouteTypesToAvoid',
      !!configuration?.routing?.displayRouteTypesToAvoid
    )
  },

  addFeatures({ commit }, { geoJSON, overwrite = false }) {
    if (!geoJSON || !geoJSON.features?.length) {
      console.error('Invalid geoJSON data.')
      return
    }

    const features = new GeoJSON().readFeatures(geoJSON)
    if (overwrite) {
      drawSource.clear()
    }
    drawSource.addFeatures(features)
    commit('updateFeatures', drawSource)
  },

  initializeConfigStyle({ commit, getters: { routingConfiguration } }) {
    if (routingConfiguration?.style?.stroke?.color) {
      commit('setSelectedStrokeColor', routingConfiguration.style.stroke.color)
    }
  },
}

export default actions
