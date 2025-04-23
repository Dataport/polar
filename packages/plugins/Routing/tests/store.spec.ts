import { PolarActionHandler } from '@polar/lib-custom-types'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { makeStoreModule } from '../src/store/index'
import { getInitialState } from '../src/store/state'
import { RoutingState, RoutingGetters } from '../src/types'
// import { reactive } from 'vue'

describe('plugin-routing', () => {
  jest.mock('ol/proj', () => ({
    transform: jest.fn((coord, from, to) => {
      if (from === 'EPSG:4326' && to === 'EPSG:25832') {
        return [9.6, 48.1] // example values
      }
      return coord
    }),
  }))
  jest.mock('ol/source/Vector', () => {
    return jest.fn().mockImplementation(() => ({
      addFeature: jest.fn(),
      clear: jest.fn(),
      addFeatures: jest.fn(),
    }))
  })

  describe('store', () => {
    describe('actions', () => {
      describe('setupModule', () => {
        const RoutingStore = makeStoreModule()
        const setupModule = RoutingStore.actions
          ?.setupModule as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof setupModule === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: getInitialState(),
            commit: jest.fn((mutation, payload) => {
              if (mutation === 'setStart') actionContext.state.start = payload
              if (mutation === 'setEnd') actionContext.state.end = payload
            }),
            dispatch: jest.fn(),
            getters: {},
            rootState: {},
            rootGetters: {
              configuration: {
                routing: {
                  displayPreferences: { avoidTolls: true },
                  displayRouteTypesToAvoid: ['highways'],
                },
              },
              map: {
                addLayer: jest.fn(),
                on: jest.fn(),
              },
            },
          }
        })

        afterEach(() => {
          jest.clearAllMocks()
        })

        it('should commit configuration settings to state', () => {
          // @ts-ignore
          setupModule(actionContext)

          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectableTravelModes',
            ['car', 'bike']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectablePreferences',
            ['fastest', 'shortest']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setDisplayPreferences',
            { avoidTolls: true }
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setDisplayRouteTypesToAvoid',
            ['highways']
          )
        })

        it('should set up the draw layer and event listener', () => {
          // @ts-ignore
          setupModule(actionContext)

          expect(actionContext.rootGetters.map.addLayer).toHaveBeenCalledTimes(
            1
          )
          expect(actionContext.rootGetters.map.on).toHaveBeenCalledWith(
            'click',
            expect.any(Function)
          )
        })

        it('should commits start and end points on map click', () => {
          let clickHandler
          actionContext.rootGetters.map.on = jest.fn((event, handler) => {
            if (event === 'click') clickHandler = handler
          })

          // @ts-ignore
          setupModule(actionContext)

          if (!clickHandler) throw new Error('Click handler was not set')

          // Simulate first click (start point)
          clickHandler({ coordinate: [10, 50] })
          expect(actionContext.commit).toHaveBeenCalledWith(
            expect.stringContaining('setStart'),
            expect.arrayContaining([10, 50])
          )
          console.error(
            'Commit history before assertion:',
            actionContext.commit.mock.calls
          )

          // Simulate second click (end point)
          clickHandler({ coordinate: [20, 60] })
          expect(actionContext.commit).toHaveBeenCalledWith('setEnd', [20, 60])
        })
      })
      describe('resetCoordinates', () => {
        const routingStore = makeStoreModule()
        const resetCoordinates = routingStore.actions
          ?.resetCoordinates as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof resetCoordinates === 'undefined') {
          throw new Error(
            'Action resetCoordinates is missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext
        beforeEach(() => {
          actionContext = {
            state: {
              start: [1, 2],
              end: [3, 4],
              startAddress: 'Start Adresse',
              endAddress: 'End Adresse',
              selectedTravelMode: 'car',
              selectedPreference: 'fastest',
              selectedRouteTypesToAvoid: ['toll'],
              routingResponseData: { data: 'some data' },
            },
            commit: jest.fn(),
            dispatch: jest.fn(),
          }
        })

        it('should reset all coordinates and related state properties', () => {
          resetCoordinates(actionContext)
          expect(actionContext.commit).toHaveBeenCalledWith('setStart', [])
          expect(actionContext.commit).toHaveBeenCalledWith('setEnd', [])
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setStartAddress',
            ''
          )
          expect(actionContext.commit).toHaveBeenCalledWith('setEndAddress', '')
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectedTravelMode',
            ''
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectedPreference',
            ''
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectedRouteTypesToAvoid',
            []
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setRoutingResponseData',
            {}
          )
          expect(actionContext.dispatch).toHaveBeenCalledWith(
            'deleteRouteDrawing'
          )
        })
      })

      describe('translateCoordinateToWGS84', () => {
        const RoutingStore = makeStoreModule()
        const translateCoordinateToWGS84 = RoutingStore.actions
          ?.translateCoordinateToWGS84 as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof translateCoordinateToWGS84 === 'undefined') {
          throw new Error(
            'Action translateCoordinateToWGS84 is missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            rootGetters: {
              configuration: { epsg: 'EPSG:25832' },
            },
          }

          // Proj4-Definitionen setzen
          proj4.defs(
            'EPSG:25832',
            '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'
          )
          proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')
          register(proj4)
        })

        it('should transform coordinates to WGS84 correctly', () => {
          const inputCoordinate = [500000, 5400000]
          const expectedCoordinate = proj4(
            'EPSG:25832',
            'EPSG:4326',
            inputCoordinate
          )

          const result = translateCoordinateToWGS84(
            actionContext,
            inputCoordinate
          )

          // Erwartung: transformierte Koordinaten sollten mit Proj4-Berechnung übereinstimmen
          expect(result).toEqual(
            expect.arrayContaining([
              expectedCoordinate[0],
              expectedCoordinate[1],
            ])
          )
        })
      })

      describe('sendRequest', () => {
        const RoutingStore = makeStoreModule()
        const sendRequest = RoutingStore.actions
          ?.sendRequest as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof sendRequest === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: {
              ...getInitialState(),
              start: [569779.2478911661, 5936605.1216985425], // Beispielkoordinaten in EPSG:25832
              end: [564138.3342705927, 5937211.3700576415], // Beispielkoordinaten in EPSG:25832
            },
            commit: jest.fn(),
            dispatch: jest.fn().mockResolvedValue([9.6, 48.1]), // Beispiel: Umgewandelte Koordinaten in WGS84
            rootGetters: {
              configuration: {
                routing: { serviceUrl: 'http://example.com', format: 'json' },
              },
            },
          }

          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  features: [
                    {
                      geometry: {
                        coordinates: [
                          [19.6, 48.1],
                          [19.5, 47.1],
                        ],
                      },
                    },
                  ],
                }),
            })
          )
        })

        afterEach(() => {
          jest.clearAllMocks()
        })

        it('should fetch routing data and commit the response', async () => {
          // Mock for `dispatch` in order to transform the coordinates
          actionContext.dispatch = jest
            .fn()
            .mockImplementation((action, payload) => {
              if (action === 'translateCoordinateToWGS84') {
                return payload === actionContext.state.start
                  ? [19.6, 48.1]
                  : [19.5, 47.1] // example coordinates in WGS84
              }
            })

          // Mock for fetch
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  features: [
                    {
                      geometry: {
                        coordinates: [
                          [19.6, 48.1],
                          [19.5, 47.1],
                        ],
                      },
                    },
                  ],
                }),
            })
          )

          await sendRequest(actionContext)

          // Erwartung: fetch wird korrekt aufgerufen
          expect(fetch).toHaveBeenCalledWith('http://example.com/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: [
                [19.6, 48.1],
                [19.5, 47.1],
              ], // Transformierte Koordinaten
              geometry: true,
              instructions: true,
              language: 'en',
              options: {
                avoid_features: [],
              },
              preference: '',
              units: 'm',
            }),
          })

          // Expectation: commit is called correctly
          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setRoutingResponseData',
            {
              features: [
                {
                  geometry: {
                    coordinates: [
                      [19.6, 48.1],
                      [19.5, 47.1],
                    ],
                  },
                },
              ],
            }
          )

          // Erwartung: drawRoute wird ausgelöst
          expect(actionContext.dispatch).toHaveBeenCalledWith('drawRoute')
        })

        it('should handle fetch errors correctly', async () => {
          const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: false,
              status: 500,
            })
          )

          await sendRequest(actionContext)

          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Route could not be determined')
          )

          consoleErrorSpy.mockRestore()
        })
      })

      describe('sendSearchRequest', () => {
        const RoutingStore = makeStoreModule()
        let actionContext
        let mockResponseXML

        beforeEach(() => {
          actionContext = {
            commit: jest.fn(),
            dispatch: jest.fn().mockResolvedValue({ features: [] }), // Mock für `parseResponse`
            rootGetters: {
              configuration: {
                routing: {
                  addressSearch: {
                    searchMethods: [{ url: 'http://example.com/wfs' }],
                    minLength: 3,
                  },
                },
              },
            },
          }

          mockResponseXML = `
            <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs/2.0">
              <wfs:member>
                <dog:Strasse xmlns:dog="http://example.com/dog">
                  <dog:strassenname>Main Street</dog:strassenname>
                </dog:Strasse>
              </wfs:member>
            </wfs:FeatureCollection>
          `

          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              text: () => Promise.resolve(mockResponseXML),
            })
          )
        })

        afterEach(() => {
          jest.clearAllMocks()
        })

        it('should fetch and process street search results correctly', async () => {
          actionContext.dispatch.mockResolvedValueOnce({
            features: [{ strassenname: 'Main Street' }],
          })

          actionContext.dispatch.mockResolvedValueOnce([{ hausnummer: '10' }])

          await RoutingStore.actions.sendSearchRequest(actionContext, {
            input: 'Mai',
          })

          expect(fetch).toHaveBeenCalledWith(
            'http://example.com/wfs&service=WFS&request=GetFeature&version=2.0.0&StoredQuery_ID=findeStrasse&strassenname=Mai',
            { method: 'GET' }
          )

          expect(actionContext.dispatch).toHaveBeenCalledWith(
            'parseResponse',
            expect.any(String)
          )

          expect(actionContext.dispatch).toHaveBeenCalledWith(
            'fetchHausnummern',
            'Main Street'
          )

          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSearchResults',
            [{ strassenname: 'Main Street', hausnummern: ['10'] }]
          )
        })

        it('should log an error when input is too short', async () => {
          const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

          await RoutingStore.actions.sendSearchRequest(actionContext, {
            input: 'Ma',
          })

          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Input is too short or missing.'
          )

          expect(fetch).not.toHaveBeenCalled()
          expect(actionContext.commit).not.toHaveBeenCalled()

          consoleErrorSpy.mockRestore()
        })

        it('should handle fetch errors correctly', async () => {
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: false,
              status: 500,
            })
          )

          const consoleErrorSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

          await RoutingStore.actions.sendSearchRequest(actionContext, {
            input: 'Main Street',
          })

          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Error in sendSearchRequest:',
            expect.any(Error) // allows for any Error-Objekt
          )

          expect(actionContext.commit).not.toHaveBeenCalled()

          consoleErrorSpy.mockRestore()
        })
      })

      describe('parseResponse', () => {
        const RoutingStore = makeStoreModule()
        const parseResponse = RoutingStore.actions?.parseResponse as (
          context: any,
          text: string
        ) => { features: any[] }

        if (typeof parseResponse === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        it('should parse a valid WFS XML response correctly', () => {
          const xmlResponse = `
            <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                                  xmlns:dog="http://example.com/dog"
                                  xmlns:gml="http://www.opengis.net/gml">
              <wfs:member>
                <dog:Strassen>
                  <dog:strassenname>Hauptstraße</dog:strassenname>
                  <dog:ortsteilname>Altstadt</dog:ortsteilname>
                  <gml:pos>10.0 50.0</gml:pos>
                  <gml:posList>10.0 50.0 20.0 60.0</gml:posList>
                  <dog:hausnummer>1</dog:hausnummer>
                  <dog:hausnummer>2</dog:hausnummer>
                </dog:Strassen>
              </wfs:member>
            </wfs:FeatureCollection>`

          const result = parseResponse({}, xmlResponse)

          expect(result.features).toHaveLength(1)
          expect(result.features[0]).toEqual({
            strassenname: 'Hauptstraße',
            ortsteilname: 'Altstadt',
            position: [10.0, 50.0],
            boundingPolygon: [10.0, 50.0, 20.0, 60.0],
            hausnummern: ['1', '2'],
          })
        })

        it('should return an empty array for an empty response', () => {
          const xmlResponse = `<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"/>`
          const result = parseResponse({}, xmlResponse)

          expect(result.features).toEqual([])
        })

        it('should handle missing elements gracefully', () => {
          const xmlResponse = `
            <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                xmlns:dog="http://example.com/dog"
                  xmlns:gml="http://www.opengis.net/gml">
              <wfs:member>
                <dog:Strassen>
                  <dog:strassenname>Unbekannte Straße</dog:strassenname>
                </dog:Strassen>
              </wfs:member>
            </wfs:FeatureCollection>`

          const result = parseResponse({}, xmlResponse)

          expect(result.features).toHaveLength(1)
          expect(result.features[0]).toEqual({
            strassenname: 'Unbekannte Straße',
            ortsteilname: 'Unbekannt', // Default-Wert
            position: null,
            boundingPolygon: null,
            hausnummern: [],
          })
        })

        it('should catche parsing errors and return an empty array', () => {
          const invalidXml = `<invalid<xml`
          const result = parseResponse({}, invalidXml)

          expect(result.features).toEqual([])
        })
      })

      describe('parseResponseHausnummern', () => {
        const RoutingStore = makeStoreModule()
        const parseResponseHausnummern = RoutingStore.actions
          ?.parseResponseHausnummern as (
          context: any,
          responseText: string
        ) => { features: any[] }

        if (typeof parseResponseHausnummern === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        it('should parse a valid house number response correctly', () => {
          const xmlResponse = `
            <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                                  xmlns:gages="http://example.com/gages"
                                  xmlns:dog="http://example.com/dog"
                                  xmlns:iso19112="http://example.com/iso19112"
                                  xmlns:gml="http://www.opengis.net/gml">
              <wfs:member>
                <gages:Hauskoordinaten>
                  <dog:hausnummer>10</dog:hausnummer>
                  <dog:hausnummernzusatz>A</dog:hausnummernzusatz>
                  <iso19112:geographicIdentifier>Berlin Mitte</iso19112:geographicIdentifier>
                  <gml:pos>13.405 52.52</gml:pos>
                  <gml:posList>13.405 52.52 13.406 52.521</gml:posList>
                </gages:Hauskoordinaten>
              </wfs:member>
            </wfs:FeatureCollection>`

          const result = parseResponseHausnummern({}, xmlResponse)

          expect(result.features).toHaveLength(1)
          expect(result.features[0]).toEqual({
            hausnummer: '10',
            hausnummerZusatz: 'A',
            geographicIdentifier: 'Berlin Mitte',
            position: [13.405, 52.52],
            boundingPolygon: [13.405, 52.52, 13.406, 52.521],
          })
        })

        it('should return an empty array for an empty response', () => {
          const xmlResponse = `<wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"/>`
          const result = parseResponseHausnummern({}, xmlResponse)

          expect(result.features).toEqual([])
        })

        it('should handle missing elements gracefully', () => {
          const xmlResponse = `
            <wfs:FeatureCollection xmlns:wfs="http://www.opengis.net/wfs"
                                  xmlns:gages="http://example.com/gages"
                                  xmlns:dog="http://example.com/dog"
                                  xmlns:iso19112="http://example.com/iso19112"
                                  xmlns:gml="http://www.opengis.net/gml">
              <wfs:member>
                <gages:Hauskoordinaten>
                  <dog:hausnummer>15</dog:hausnummer>
                </gages:Hauskoordinaten>
              </wfs:member>
            </wfs:FeatureCollection>`

          const result = parseResponseHausnummern({}, xmlResponse)

          expect(result.features).toHaveLength(1)
          expect(result.features[0]).toEqual({
            hausnummer: '15',
            hausnummerZusatz: '', // Default-Wert
            geographicIdentifier: '', // Default-Wert
            position: [], // Kein <gml:pos>
            boundingPolygon: [], // Kein <gml:posList>
          })
        })

        it('should catch parsing errors and return an empty array', () => {
          const invalidXml = `<invalid<xml`
          const result = parseResponseHausnummern({}, invalidXml)

          expect(result.features).toEqual([])
        })
      })
    })
  })
})
