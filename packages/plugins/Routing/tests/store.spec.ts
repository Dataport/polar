// NOTE: action tests currently not type-supported, but working
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PolarActionHandler } from '@polar/lib-custom-types'
import { makeStoreModule } from '../src/store'
import { getInitialState } from '../src/store/state'
import { RoutingState, RoutingGetters } from '../src/types'

describe('plugin-routing', () => {
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
        let addLayer
        let dispatch

        beforeEach(() => {
          addLayer = jest.fn()
          dispatch = jest.fn()
          actionContext = {
            dispatch,
            rootGetters: {
              map: {
                addLayer,
              },
            },
          }
        })

        afterEach(() => {
          jest.clearAllMocks()
        })

        it('should initialize the draw layer and the draw interaction', () => {
          // @ts-ignore
          setupModule(actionContext)

          expect(dispatch).toHaveBeenCalledTimes(1)
          expect(dispatch).toHaveBeenCalledWith('initializeDraw')
          expect(addLayer).toHaveBeenCalledTimes(1)
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
        let commit
        let dispatch

        beforeEach(() => {
          commit = jest.fn()
          dispatch = jest.fn()
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
            commit,
            dispatch,
          }
        })

        it('should reset all coordinates and related state properties', () => {
          // @ts-ignore
          reset(actionContext)
          expect(commit).toHaveBeenCalledTimes(6)
          expect(commit).toHaveBeenCalledWith('resetRoute')
          expect(commit).toHaveBeenCalledWith('setCurrentlyFocusedInput', -1)
          expect(commit).toHaveBeenCalledWith(
            'setSelectedTravelMode',
            'driving-car'
          )
          expect(commit).toHaveBeenCalledWith(
            'setSelectedPreference',
            'recommended'
          )
          expect(commit).toHaveBeenCalledWith(
            'setSelectedRouteTypesToAvoid',
            []
          )
          expect(commit).toHaveBeenCalledWith('setRoutingResponseData', {})
          expect(dispatch).toHaveBeenCalledWith('clearRoute')
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
        let commit
        let dispatch

        beforeEach(() => {
          commit = jest.fn()
          dispatch = jest.fn()
          actionContext = {
            state: {
              ...getInitialState(),
              selectedRouteTypesToAvoid: ['tollways'],
              selectedPreference: 'recommended',
            },
            commit,
            dispatch,
            getters: {
              configuration: {
                apiKey: 'my-secure-key',
              },
              url: 'http://example.com/driving-car/json',
              routeAsWGS84: [
                [19.6, 48.1],
                [19.5, 47.1],
              ],
            },
          }

          // @ts-ignore
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
          // @ts-ignore
          await getRoute(actionContext)

          expect(fetch).toHaveBeenCalledWith(
            'http://example.com/driving-car/json',
            {
              method: 'POST',
              headers: {
                /* eslint-disable @typescript-eslint/naming-convention */
                'Content-Type': 'application/json',
                Authorization: 'my-secure-key',
                /* eslint-enable @typescript-eslint/naming-convention */
              },
              body: JSON.stringify({
                coordinates: [
                  [19.6, 48.1],
                  [19.5, 47.1],
                ],
                geometry: true,
                instructions: true,
                language: 'en',
                options: {
                  avoid_features: ['tollways'],
                },
                preference: 'recommended',
                units: 'm',
              }),
            }
          )

          expect(commit).toHaveBeenCalledTimes(1)
          expect(commit).toHaveBeenCalledWith('setRoutingResponseData', {
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
          })
          expect(dispatch).toHaveBeenCalledTimes(2)
          expect(dispatch).toHaveBeenCalledWith('clearRoute')
          expect(dispatch).toHaveBeenCalledWith('drawRoute')
        })

        it('should handle fetch errors correctly', async () => {
          // @ts-ignore
          global.fetch = jest.fn(() =>
            Promise.resolve({
              ok: false,
              status: 500,
            })
          )

          // @ts-ignore
          await getRoute(actionContext)

          expect(commit).toHaveBeenCalledTimes(0)
          expect(dispatch).toHaveBeenCalledTimes(2)
          expect(dispatch).toHaveBeenCalledWith('clearRoute')
          expect(dispatch).toHaveBeenCalledWith(
            'handleErrors',
            new Error(
              'Route could not be determined. Try different coordinates.'
            )
          )
        })
      })
    })
  })
})
