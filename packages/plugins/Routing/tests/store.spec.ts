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
      describe('reset', () => {
        const routingStore = makeStoreModule()
        const reset = routingStore.actions?.reset as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof reset === 'undefined') {
          throw new Error(
            'Action reset is missing in RoutingStore. Tests could not be run.'
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
              selectedTravelMode: 'driving-car',
              selectedPreference: 'fastest',
              selectedRouteTypesToAvoid: ['toll'],
              routingResponseData: { data: 'some data' },
            },
            commit: jest.fn(),
            dispatch: jest.fn(),
          }
        })

        it('should reset all coordinates and related state properties', () => {
          reset(actionContext)
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

      describe('getRoute', () => {
        const RoutingStore = makeStoreModule()
        const getRoute = RoutingStore.actions?.getRoute as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof getRoute === 'undefined') {
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
                routing: { url: 'http://example.com', format: 'json' },
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

          await getRoute(actionContext)

          // Erwartung: fetch wird korrekt aufgerufen
          expect(fetch).toHaveBeenCalledWith('http://example.com/json', {
            method: 'POST',
            headers: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'Content-Type': 'application/json', // eslint error has to be ignored since name is determined by ORS
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

          await getRoute(actionContext)

          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Route could not be determined')
          )

          consoleErrorSpy.mockRestore()
        })
      })
    })
  })
})
