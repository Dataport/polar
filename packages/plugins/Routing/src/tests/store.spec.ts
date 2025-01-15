import { PolarActionHandler } from '@polar/lib-custom-types'
import proj4 from 'proj4'
import { register } from 'ol/proj/proj4'
import { makeStoreModule } from '../store/index'
import { getInitialState } from '../store/state'
import { RoutingState, RoutingGetters } from '../types'

describe('plugin-routing', () => {
  describe('store', () => {
    describe('actions', () => {
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
            state: getInitialState(),
            commit: jest.fn(),
          }
        })

        it('reset the start and end coordinates', () => {
          resetCoordinates(actionContext)
          expect(actionContext.commit).toHaveBeenCalledWith('setStart', [])
          expect(actionContext.commit).toHaveBeenCalledWith('setEnd', [])
        })
      })

      describe('createUrl', () => {
        const routingStore = makeStoreModule()
        const createUrl = routingStore.actions?.createUrl as PolarActionHandler<
          RoutingState,
          RoutingGetters
        >

        if (typeof createUrl === 'undefined') {
          throw new Error(
            'Action createUrl is missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext
        beforeEach(() => {
          actionContext = {
            rootGetters: {
              configuration: {
                routing: {
                  serviceUrl:
                    'https://geodienste.hamburg.de/web_ors/v2/directions/',
                  format: 'geojson',
                },
              },
            },
            state: {
              selectedTravelMode: 'car',
            },
          }
        })

        it('create the correct request url', () => {
          const url = createUrl(actionContext)
          expect(url).toBe(
            'https://geodienste.hamburg.de/web_ors/v2/directions/car/geojson'
          )
        })
      })

      describe('checkConfig', () => {
        const routingStore = makeStoreModule()
        const checkConfig = routingStore.actions
          ?.checkConfig as PolarActionHandler<RoutingState, RoutingGetters>

        if (typeof checkConfig === 'undefined') {
          throw new Error(
            'Action checkConfig is missing in RoutingStore. Tests could not be run.'
          )
        }

        let actionContext
        beforeEach(() => {
          actionContext = {
            rootGetters: {
              configuration: {
                routing: {
                  selectableTravelModes: ['cycling-regular', 'foot-walking'],
                  selectablePreferences: ['fastest', 'shortest', 'recommended'],
                  displayPreferences: true,
                  displayRouteTypesToAvoid: false,
                },
              },
            },
            commit: jest.fn(),
          }
        })

        it('store selectableTravelModes from config in store', () => {
          checkConfig(actionContext)
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectableTravelModes',
            ['cycling-regular', 'foot-walking']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setSelectablePreferences',
            ['fastest', 'shortest', 'recommended']
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setDisplayPreferences',
            true
          )
          expect(actionContext.commit).toHaveBeenCalledWith(
            'setDisplayRouteTypesToAvoid',
            false
          )
        })
      })
    })
  })
})
