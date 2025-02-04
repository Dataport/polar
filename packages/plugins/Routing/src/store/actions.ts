import VectorSource from 'ol/source/Vector'
import { LineString } from 'ol/geom'
import Feature from 'ol/Feature'
import { PolarActionTree } from '@polar/lib-custom-types'
import GeoJSON from 'ol/format/GeoJSON'
import { transform } from 'ol/proj'
import {
  RoutingState,
  RoutingGetters,
  FeatureInterface,
  SearchResponseDataInterface,
} from '../types'
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

    /* update state with configuration settings */

    if (configuration?.routing?.selectableTravelModes.length > 0) {
      commit(
        'setSelectableTravelModes',
        configuration?.routing?.selectableTravelModes
      )
    }
    if (configuration?.routing?.selectablePreferences.length > 0) {
      commit(
        'setSelectablePreferences',
        configuration?.routing?.selectablePreferences
      )
    }
    commit('setDisplayPreferences', configuration?.routing?.displayPreferences)
    commit(
      'setDisplayRouteTypesToAvoid',
      configuration?.routing?.displayRouteTypesToAvoid
    )
  },

  /* ROUTING REQUEST */

  /**
   * Translates a given coordinate to the WGS84 coordinate system (EPSG:4326).
   *
   * @param context - The Vuex action context.
   * @param rootGetters - The root getters from Vuex store.
   * @param contextRootGettersConfiguration - The configuration object containing the EPSG code.
   * @param Coordinate - The coordinate to be transformed.
   * @returns The transformed coordinate in the WGS84 coordinate system.
   */
  translateCoordinateToWGS84({ rootGetters: { configuration } }, Coordinate) {
    const wgs84Coordinate = transform(
      Coordinate,
      configuration?.epsg,
      'EPSG:4326'
    )
    return wgs84Coordinate
  },
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
  /**
   * Sends a routing request to the external service.
   * @param context - VueX action context.
   * @param contextCommit - VueX commit function.
   * @param contextDispatch - VueX dispatch function.
   * @param contextState - VueX state object.
   */
  async sendRequest({ commit, dispatch, state }) {
    const searchCoordinates = [
      await dispatch('translateCoordinateToWGS84', state.start),
      await dispatch('translateCoordinateToWGS84', state.end),
    ]
    const url = await dispatch('createUrl')
    const fetchDirections = async () => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json', // eslint error has to be ignored since name is determined by "BKG Routing-Dienst"
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
          throw new Error(
            'Route could not be determined. Try different coordinates.'
          )
        }
        const data = await response.json()
        commit('setSearchResponseData', data)
        dispatch('drawRoute')
      } catch (error) {
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
      }
    }
    try {
      await fetchDirections()
    } catch (error) {
      console.error('Error in sendRequest:', error)
    }
  },

  /* ADDRESS SEARCH */

  /**
   * Fetches house numbers for a given street name.
   * @param context - VueX action context.
   * @param contextRootGetters - Global getters.
   * @param contextDispatch - VueX dispatch function.
   * @param strassenname - The street name to search for.
   * @returns A list of house numbers.
   */
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      StoredQuery_ID: storedQueryID, // eslint error has to be ignored since name is determined by "AddressService HH"
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
  /**
   * Parses the response from the house number search.
   * @param _context - Unused VueX action context.
   * @param responseText - XML response text.
   * @returns Parsed house numbers data.
   */
  parseResponseHausnummern({}, responseText) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(responseText, 'application/xml')
      const members = xmlDoc.getElementsByTagName('wfs:member')
      const features: SearchResponseDataInterface[] = []

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
            positionElement?.textContent?.split(' ').map(Number) || []

          const polygonElement =
            hauskoordinaten.getElementsByTagName('gml:posList')[0]
          const boundingPolygon =
            polygonElement?.textContent?.split(' ').map(Number) || []

          features.push({
            hausnummer,
            hausnummerZusatz,
            geographicIdentifier,
            position,
            boundingPolygon,
          })
        }
      }

      return { features }
    } catch (error) {
      console.error('Error parsing house numbers response:', error)
      return { features: [] }
    }
  },
  /**
   * Parses XML response from the search request into structured data.
   * @param context - empty VueX action context.
   * @param text - XML response text.
   * @returns Parsed street data.
   */
  // empty action context is necessary here
  // eslint-disable-next-line no-empty-pattern
  parseResponse({}, text) {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, 'application/xml')
      const members = xmlDoc.getElementsByTagName('wfs:member')
      const features: FeatureInterface[] = []

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

          const hausnummern: string | null = []

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
      return { features }
    } catch (error) {
      console.error('Error parsing response:', error)
      return { features: [] }
    }
  },
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      StoredQuery_ID: storedQueryID, // eslint error has to be ignored, since name is determined by "AddresService HH"
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

      // extract the house numbers for each street of streetData
      const features = streetData.features || []
      for (const feature of features) {
        const hausnummern = await dispatch(
          'fetchHausnummern',
          feature.strassenname
        )
        feature.hausnummern = hausnummern.map((item) => item.hausnummer)
      }

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
      state.searchResponseData?.features[0].geometry.coordinates.map(
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
    commit('setSearchResponseData', {})
    dispatch('deleteRouteDrawing')
  },
}

export default actions
