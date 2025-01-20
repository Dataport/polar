import Geolocation from 'ol/Geolocation.js'
import { makeStoreModule } from '../src/store/index'

describe('plugin-geolocation', () => {
  describe('store', () => {
    describe('actions', () => {
      let consoleErrorSpy
      let consoleLogSpy
      let actionContext
      let commit
      let dispatch
      let storeModule

      beforeEach(() => {
        consoleErrorSpy = jest.fn()
        consoleLogSpy = jest.fn()
        jest.spyOn(console, 'error').mockImplementation(consoleErrorSpy)
        jest.spyOn(console, 'log').mockImplementation(consoleLogSpy)
        commit = jest.fn()
        dispatch = jest.fn()
        actionContext = {
          commit,
          dispatch,
          getters: {
            geolocation: null,
            configuredEpsg: 'EPSG:4326',
            position: [100, 100],
          },
        }
        storeModule = makeStoreModule()
      })
      afterEach(jest.restoreAllMocks)

      describe('onError', () => {
        const error = { message: 'uhoh' }
        it('should dispatch a toast if the toastAction is configured', () => {
          actionContext.getters.toastAction = 'actionName'

          storeModule.actions.onError(actionContext, error)

          expect(commit.mock.calls.length).toEqual(2)
          expect(commit.mock.calls[0]).toEqual(['setIsGeolocationDenied', true])
          expect(commit.mock.calls[1]).toEqual(['setTracking', false])
          expect(dispatch.mock.calls.length).toEqual(2)
          expect(dispatch.mock.calls[0]).toEqual([
            'actionName',
            {
              type: 'error',
              text: 'plugins.geoLocation.button.tooltip.locationAccessDenied',
            },
            { root: true },
          ])
          expect(dispatch.mock.calls[1]).toEqual(['removeMarker'])
          expect(consoleErrorSpy.mock.calls.length).toEqual(1)
          expect(consoleErrorSpy.mock.calls[0]).toEqual([
            '@polar/plugin-geo-location',
            error.message,
          ])
        })
        it('should log an additional error if the toastAction is not configured', () => {
          storeModule.actions.onError(actionContext, error)

          expect(commit.mock.calls.length).toEqual(2)
          expect(commit.mock.calls[0]).toEqual(['setIsGeolocationDenied', true])
          expect(commit.mock.calls[1]).toEqual(['setTracking', false])
          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual(['removeMarker'])
          expect(consoleErrorSpy.mock.calls.length).toEqual(2)
          expect(consoleErrorSpy.mock.calls[0]).toEqual([
            '@polar/plugin-geo-location: Location access denied by user.',
          ])
          expect(consoleErrorSpy.mock.calls[1]).toEqual([
            '@polar/plugin-geo-location',
            error.message,
          ])
        })
      })
      describe('printPositioningFailed', () => {
        it('should dispatch a toast for a boundaryError if the toastAction is configured and the given parameter has a relevant value', () => {
          actionContext.getters.toastAction = 'actionName'

          storeModule.actions.printPositioningFailed(
            actionContext,
            'boundaryError'
          )

          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual([
            'actionName',
            {
              type: 'error',
              text: 'plugins.geoLocation.toast.boundaryError',
            },
            { root: true },
          ])
          expect(consoleErrorSpy.mock.calls.length).toEqual(0)
          expect(consoleLogSpy.mock.calls.length).toEqual(0)
        })
        it('should dispatch a toast for a generic not in boundary error if the toastAction is configured and the given parameter does not have a relevant value', () => {
          actionContext.getters.toastAction = 'actionName'

          storeModule.actions.printPositioningFailed(actionContext, '')

          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual([
            'actionName',
            {
              type: 'info',
              text: 'plugins.geoLocation.toast.notInBoundary',
              timeout: 10000,
            },
            { root: true },
          ])
          expect(consoleErrorSpy.mock.calls.length).toEqual(0)
          expect(consoleLogSpy.mock.calls.length).toEqual(0)
        })
        it('should log only an error for a boundaryError if the toastAction is not configured and the given parameter has a relevant value', () => {
          storeModule.actions.printPositioningFailed(
            actionContext,
            'boundaryError'
          )

          expect(dispatch.mock.calls.length).toEqual(0)
          expect(consoleErrorSpy.mock.calls.length).toEqual(1)
          expect(consoleErrorSpy.mock.calls[0]).toEqual([
            'Checking boundary layer failed.',
          ])
          expect(consoleLogSpy.mock.calls.length).toEqual(0)
        })
        it('should log only an error for a generic not in boundary error if the toastAction is not configured and the given parameter does not have a relevant value', () => {
          storeModule.actions.printPositioningFailed(actionContext, '')

          expect(dispatch.mock.calls.length).toEqual(0)
          expect(consoleErrorSpy.mock.calls.length).toEqual(0)
          expect(consoleLogSpy.mock.calls.length).toEqual(1)
          expect(consoleLogSpy.mock.calls[0]).toEqual([
            'User position outside of boundary layer.',
          ])
        })
      })
      describe('track', () => {
        it('instantiate the OpenLayers GeoLocation object and commit it to the store if the geolocation was not denied and the GeoLocation object has not been set yet', () => {
          actionContext.getters.isGeolocationDenied = false

          storeModule.actions.track(actionContext)

          expect(commit.mock.calls.length).toEqual(2)
          expect(commit.mock.calls[0][0]).toEqual('setGeolocation')
          expect(commit.mock.calls[0][1] instanceof Geolocation).toEqual(true)
          expect(commit.mock.calls[0][1].getTracking()).toEqual(true)
          expect(commit.mock.calls[0][1].getProjection().getCode()).toEqual(
            'EPSG:4326'
          )
          expect(commit.mock.calls[1]).toEqual(['setTracking', true])
          expect(dispatch.mock.calls.length).toEqual(0)
        })
        it('trigger the action to reposition the location if the geolocation was not denied and the geolocation has been instantiated already', () => {
          actionContext.getters.isGeolocationDenied = false
          actionContext.getters.geolocation = { on: jest.fn() }

          storeModule.actions.track(actionContext)

          expect(commit.mock.calls.length).toEqual(1)
          expect(commit.mock.calls[0]).toEqual(['setTracking', true])
          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual(['positioning'])
        })
        it('should dispatch the onError action if the geolocation was denied', () => {
          actionContext.getters.isGeolocationDenied = true

          storeModule.actions.track(actionContext)

          expect(commit.mock.calls.length).toEqual(0)
          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual(['onError'])
        })
      })
      describe('untrack', () => {
        it('should reset all relevant fields in the store, remove the marker and stop tracking', () => {
          const setTracking = jest.fn()
          actionContext.getters.geolocation = { setTracking }

          storeModule.actions.untrack(actionContext)

          expect(setTracking.mock.calls.length).toEqual(1)
          expect(setTracking.mock.calls[0]).toEqual([false])
          expect(commit.mock.calls.length).toEqual(2)
          expect(commit.mock.calls[0]).toEqual(['setTracking', false])
          expect(commit.mock.calls[1]).toEqual(['setGeolocation', null])
          expect(dispatch.mock.calls.length).toEqual(1)
          expect(dispatch.mock.calls[0]).toEqual(['removeMarker'])
        })
      })
    })
  })
})
