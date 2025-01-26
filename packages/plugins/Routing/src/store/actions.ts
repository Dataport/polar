/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
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
    console.error(configuration)
    dispatch('initializeConfigStyle') // testen
    drawLayer = createDrawLayer(drawSource)
    map?.addLayer(drawLayer) // testen, ob es passiert ist
    map?.on('click', function (event) {
      const formattedCoordinate = event.coordinate
      console.error('formatierte Koordinate: ' + formattedCoordinate)

      // prüfen, ob im state schon startAddress vorhanden ist - falls ja, die neue Koordinate als endAddress speichern
      if (state.start.length === 0) {
        commit('setStart', formattedCoordinate) // wurde setStart als commit aufgerufen und meine formatierte Coordinate reingeschrieben? Im State überprüfen
      } else if (state.end.length === 0) {
        commit('setEnd', formattedCoordinate)
      }
      console.error(event)
      console.error('Start:' + state.start + 'Ende: ' + state.end)
    })
  },
  // TODO: in utils verschieben, da es den state nicht verändert und auch von anderen Funktionen verwendet werden kann?
  translateCoordinateToWGS84({ rootGetters: { configuration } }, Coordinate) {
    console.error('Translate Methode', configuration?.epsg, Coordinate)
    const wgs84Coordinate = transform(
      Coordinate,
      configuration?.epsg,
      'EPSG:4326'
    )
    console.error('Koordinate in WGS84: ', wgs84Coordinate)
    return wgs84Coordinate
  },
  // TODO: die nächsten 7 Funktionen in utils verschieben, da sie den state nicht verändern und auch von anderen Funktionen/dem core verwendet werden können?
  createUrl({ rootGetters: { configuration }, state }) {
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
    console.error(searchCoordinates)
    const url = await dispatch('createUrl')
    console.error('Die übergebene URL: ', url)
    const fetchDirections = async () => {
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
              avoid_features: state.selectedRouteTypesToAvoid,
            },
            preference: state.selectedPreference,
            units: 'm',
          }),
        })
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
  createSearchUrl(searchInput) {
    const url =
      'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0&StoredQuery_ID=findeStrasse&strassenname=' +
      searchInput
    return url
  },
  async fetchHausnummern(
    { rootGetters: { configuration }, dispatch },
    strassenname
  ) {
    const searchMethod = configuration.routing.addressSearch.searchMethods[0]
    console.error('Suchmethode:', searchMethod)
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
    { commit, rootGetters: { configuration }, dispatch },
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
      console.error('Text:', text)
      const streetData = await dispatch('parseResponse', text)

      const features = streetData.features || []
      console.error('Features:', features)
      for (const feature of features) {
        const hausnummern = await dispatch(
          'fetchHausnummern',
          feature.strassenname
        )
        console.error('hausnummern log', hausnummern)
        feature.hausnummern = hausnummern.map((item) => item.hausnummer)
      }

      commit('setSearchResults', features)
      console.log('Final search results with house numbers:', features)
    } catch (error) {
      console.error('Error in sendSearchRequest:', error)
    }
  },
  parseResponse({}, text) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, 'application/xml')
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
    console.error(`stored response: `, state.searchResponseData)
    const transformedCoordinates =
      state.searchResponseData.features[0].geometry.coordinates.map(
        (coordinate) => transform(coordinate, 'EPSG:4326', 'EPSG:25832')
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
    console.error('New feature: ',drawSource.getFeatures())
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
  deleteRouteDrawing() {
    drawSource.clear()
    console.error('cleared features: ', drawSource.getFeatures())
  },
  resetCoordinates({ commit, dispatch, state }) {
    commit('setStart', [])
    commit('setEnd', [])
    commit('setStartAddress', '')
    commit('setEndAddress', '')
    commit('setSelectedRouteTypesToAvoid', [])
    commit('setSearchResponseData', {})
    console.error(
      'Start- und Endpunkt im Store nach reset:',
      state.start,
      state.end
    )
    console.error(
      'searchResponseData im Store nach reset:',
      state.searchResponseData
    )
    dispatch('deleteRouteDrawing')
  },
}

export default actions
