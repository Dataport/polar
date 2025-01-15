/* eslint-disable max-lines */
// NOTE: action tests currently not type-supported, but working
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PolarActionHandler } from '@polar/lib-custom-types'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { makeStoreModule } from '../store/index'
import { getInitialState } from '../store/state'
import { RoutingState, RoutingGetters } from '../types'

describe('plugin-routing', () => {
  const createMockDrawSource = () => ({
    addFeature: jest.fn(),
    addFeatures: jest.fn(),
    clear: jest.fn(),
  })
  describe('store', () => {
    describe('actions', () => {
      describe('initializeTool', () => {
        const RoutingStore = makeStoreModule()
        const initializeTool = RoutingStore.actions
          ?.initializeTool as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof initializeTool === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: getInitialState(),
            commit: jest.fn(),
            dispatch: jest.fn(),
            getters: {},
            rootState: {},
            rootGetters: {
              configuration: {
                routing: {
                  serviceUrl: 'http://example.com',
                  format: 'json',
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

        it('dispatches initializeConfigStyle and sets up the draw layer', () => {
          // @ts-ignore
          initializeTool(actionContext)

          expect(actionContext.dispatch).toHaveBeenCalledWith(
            'initializeConfigStyle'
          )
          expect(actionContext.rootGetters.map.addLayer).toHaveBeenCalledTimes(
            1
          )
          expect(actionContext.rootGetters.map.on).toHaveBeenCalledWith(
            'click',
            expect.any(Function)
          )
        })

        it('commits start and end points on map click', () => {
          const mockClickHandler = jest.fn()
          actionContext.rootGetters.map.on = jest.fn((event, handler) => {
            if (event === 'click') mockClickHandler.mockImplementation(handler)
          })

          // @ts-ignore
          initializeTool(actionContext)

          // Simuliere einen Klick
          const mockEvent = { coordinate: [10, 50] }
          mockClickHandler(mockEvent)

          expect(actionContext.commit).toHaveBeenCalledWith(
            'setStart',
            [10, 50]
          )
        })
      })

      describe('resetCoordinates', () => {
        const RoutingStore = makeStoreModule()
        const resetCoordinates = RoutingStore.actions
          ?.resetCoordinates as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof resetCoordinates === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: getInitialState(),
            commit: jest.fn(),
          }
        })

        it('resets the start and end coordinates', () => {
          // @ts-ignore
          resetCoordinates(actionContext)

          expect(actionContext.commit).toHaveBeenCalledWith('setStart', [])
          expect(actionContext.commit).toHaveBeenCalledWith('setEnd', [])
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
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: getInitialState(),
            rootGetters: {
              configuration: { epsg: 'EPSG:25832' },
            },
          }

          // Registriere die Projektionen
          proj4.defs(
            'EPSG:25832',
            '+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs'
          )
          proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs')
          register(proj4)
        })

        it('transforms coordinates to WGS84', () => {
          const inputCoordinate = [500000, 5400000]
          const result = translateCoordinateToWGS84.call(
            RoutingStore,
            actionContext,
            inputCoordinate
          )

          // Überprüfen, ob die Rückgabe korrekt transformiert wurde
          expect(result).toEqual(expect.any(Array))
          expect(result.length).toBe(2) // sollte ein [longitude, latitude] Array sein
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
              start: [500000, 5400000], // Beispielkoordinaten in EPSG:25832
              end: [510000, 5500000], // Beispielkoordinaten in EPSG:25832
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
                          [10, 50],
                          [20, 60],
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

        it('fetches routing data and commits the response', async () => {
          // Mock für `dispatch` zur Transformation der Koordinaten
          actionContext.dispatch = jest
            .fn()
            .mockImplementation((action, payload) => {
              if (action === 'translateCoordinateToWGS84') {
                return [9.6, 48.1] // Beispielkoordinaten in WGS84
              }
              if (action === 'createUrl') {
                return 'http://example.com/json'
              }
            })

          // Mock für fetch
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              json: () =>
                Promise.resolve({
                  features: [
                    {
                      geometry: {
                        coordinates: [
                          [10, 50],
                          [20, 60],
                        ],
                      },
                    },
                  ],
                }),
            })
          )

          // @ts-ignore
          await sendRequest(actionContext)

          // Erwartung: fetch wird korrekt aufgerufen
          expect(fetch).toHaveBeenCalledWith('http://example.com/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: [
                [9.6, 48.1],
                [9.6, 48.1],
              ], // Transformierte Koordinaten
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

          // Erwartung: commit wird korrekt aufgerufen
          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSearchResponseData',
            {
              features: [
                {
                  geometry: {
                    coordinates: [
                      [10, 50],
                      [20, 60],
                    ],
                  },
                },
              ],
            }
          )

          // Erwartung: drawRoute wird ausgelöst
          expect(actionContext.dispatch).toHaveBeenCalledWith('drawRoute')
        })
      })
      describe('createUrl', () => {
        const RoutingStore = makeStoreModule()
        const createUrl = RoutingStore.actions?.createUrl as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof createUrl === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: {
              ...getInitialState(),
              selectedTravelMode: 'driving',
            },
            rootGetters: {
              configuration: {
                routing: {
                  serviceUrl: 'http://example.com/',
                  format: 'json',
                },
              },
            },
          }
        })

        it('generates the correct URL', () => {
          // @ts-ignore
          const url = createUrl(actionContext)
          expect(url).toBe('http://example.com/driving/json')
        })
      })
      describe('createSearchUrl', () => {
        const RoutingStore = makeStoreModule()
        const createSearchUrl = RoutingStore.actions
          ?.createSearchUrl as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof createSearchUrl === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        it('generates the correct search URL', () => {
          const searchInput = 'Hauptstraße'
          const url = createSearchUrl(searchInput)
          expect(url).toBe(
            'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0&StoredQuery_ID=findeStrasse&strassenname=Hauptstraße'
          )
        })
      })

      describe('sendSearchRequest', () => {
        const RoutingStore = makeStoreModule()
        const sendSearchRequest = RoutingStore.actions
          ?.sendSearchRequest as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof sendSearchRequest === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            state: {
              ...getInitialState(),
              minLength: 3,
            },
            dispatch: jest.fn(),
          }

          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: true,
              text: () => Promise.resolve('Some response text'),
            })
          )
        })

        it('dispatches createSearchUrl and fetches data', async () => {
          const searchInput = 'Hauptstraße'

          // Mock dispatch für createSearchUrl
          actionContext.dispatch.mockImplementation((action, payload) => {
            if (action === 'createSearchUrl') {
              return `https://example.com/search?q=${payload}`
            }
          })

          // @ts-ignore
          await sendSearchRequest(actionContext, searchInput)

          expect(actionContext.dispatch).toHaveBeenCalledWith(
            'createSearchUrl',
            searchInput
          )
          expect(fetch).toHaveBeenCalledWith(
            'https://example.com/search?q=Hauptstraße',
            {
              method: 'GET',
            }
          )
        })
      })
      describe('drawRoute', () => {
        const RoutingStore = makeStoreModule()
        const drawRoute = RoutingStore.actions?.drawRoute as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof drawRoute === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext
        let mockDrawSource

        beforeEach(() => {
          mockDrawSource = createMockDrawSource()
          global.drawSource = mockDrawSource // Globale Variable mocken

          actionContext = {
            state: {
              searchResponseData: {
                features: [
                  {
                    geometry: {
                      coordinates: [
                        [9.6, 48.1],
                        [10.1, 49.3],
                      ],
                    },
                  },
                ],
              },
            },
            rootGetters: {
              configuration: {
                routing: {
                  style: {
                    stroke: {
                      color: '#ff0000',
                    },
                  },
                },
              },
            },
          }
        })

        afterEach(() => {
          delete global.drawSource // Globale Mock-Variable entfernen
        })

        it('transforms coordinates and adds features to the layer', () => {
          // @ts-ignore
          drawRoute(actionContext)

          expect(mockDrawSource.addFeature).toHaveBeenCalledTimes(1)
          expect(
            mockDrawSource.addFeature.mock.calls[0][0]
              .getGeometry()
              .getCoordinates()
          ).toEqual([
            [9.6, 48.1],
            [10.1, 49.3],
          ]) // Erwartete Koordinaten
        })
      })

      describe('checkConfig', () => {
        const RoutingStore = makeStoreModule()
        const checkConfig = RoutingStore.actions
          ?.checkConfig as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof checkConfig === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            rootGetters: {
              configuration: {
                routing: {
                  selectableTravelModes: ['driving', 'walking'],
                  selectablePreferences: ['fastest', 'shortest'],
                  displayPreferences: true,
                  displayRouteTypesToAvoid: false,
                },
              },
            },
            commit: jest.fn(),
          }
        })

        it('commits the configuration correctly', () => {
          // @ts-ignore
          checkConfig(actionContext)

          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectableTravelModes',
            ['driving', 'walking']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectablePreferences',
            ['fastest', 'shortest']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setDisplayPreferences',
            true
          )
        })
      })
      describe('addFeatures', () => {
        const RoutingStore = makeStoreModule()
        const addFeatures = RoutingStore.actions
          ?.addFeatures as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof addFeatures === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext
        let mockDrawSource

        beforeEach(() => {
          mockDrawSource = createMockDrawSource()
          global.drawSource = mockDrawSource // Mock drawSource global verfügbar machen

          actionContext = {
            commit: jest.fn(),
          }
        })

        afterEach(() => {
          delete global.drawSource // Entferne den globalen Mock nach dem Test
        })

        it('adds features to the layer', () => {
          const geoJSON = {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [10, 50],
                },
              },
            ],
          }

          // @ts-ignore
          addFeatures(actionContext, { geoJSON, overwrite: true })

          expect(mockDrawSource.clear).toHaveBeenCalledTimes(1)
          expect(mockDrawSource.addFeatures).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith(
            'updateFeatures',
            mockDrawSource
          )
        })
      })

      describe('initializeConfigStyle', () => {
        const RoutingStore = makeStoreModule()
        const initializeConfigStyle = RoutingStore.actions
          ?.initializeConfigStyle as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof initializeConfigStyle === 'undefined') {
          throw new Error(
            'Actions missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext

        beforeEach(() => {
          actionContext = {
            commit: jest.fn(),
            getters: {
              routingConfiguration: {
                style: {
                  stroke: {
                    color: '#00ff00',
                  },
                },
              },
            },
          }
        })

        it('commits the stroke color correctly', () => {
          // @ts-ignore
          initializeConfigStyle(actionContext)

          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectedStrokeColor',
            '#00ff00'
          )
        })
      })
    })
  })
})
