// NOTE: action tests currently not type-supported, but working
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PolarActionHandler } from '@polar/lib-custom-types'
import { getInitialState, makeStoreModule } from '../src/store'
import { Toast, ToastState } from '../src/types'

describe('plugin-toast', () => {
  describe('store', () => {
    describe('actions', () => {
      describe('addToast', () => {
        const ToastStore = makeStoreModule()
        const addToast = ToastStore.actions?.addToast as PolarActionHandler<
          ToastState,
          ToastState
        >

        if (typeof addToast === 'undefined') {
          throw new Error(
            'Actions missing in ToastStore. Tests could not be run.'
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
            rootGetters: {},
          }

          jest.useFakeTimers()
          jest.spyOn(global, 'setTimeout')
        })

        afterEach(() => {
          jest.useRealTimers()
          jest.clearAllMocks()
        })

        it('adds the toast element to the store', () => {
          const toast: Toast = {
            type: 'success',
            text: 'Vectors have been triangulated.',
          }
          // @ts-ignore
          addToast(actionContext, toast)
          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith('addToast', toast)
        })

        it('prefers toast style to configured style', () => {
          actionContext.state.types.error.icon = 'print-slash'
          actionContext.state.types.error.color = 'orange'
          const toast: Toast = {
            type: 'error',
            text: 'You are out of cyan.',
            color: 'cyan',
          }
          // @ts-ignore
          addToast(actionContext, toast)
          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith('addToast', {
            type: 'error',
            text: 'You are out of cyan.',
            color: 'cyan',
            icon: 'print-slash',
          })
        })

        it('uses positive timeouts to remove the toast automatically', () => {
          const toast: Toast = {
            type: 'warning',
            text: 'Fast reading required.',
            timeout: 100,
          }

          // @ts-ignore
          addToast(actionContext, toast)

          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith('addToast', toast)

          jest.runAllTimers()

          expect(actionContext.commit).toHaveBeenCalledTimes(2)
          expect(actionContext.commit).toHaveBeenCalledWith(
            'removeToast',
            toast
          )
        })

        it('does not set timeouts on timeout being 0', () => {
          const toast: Toast = {
            type: 'info',
            text: "I'm not going anywhere.",
            timeout: 0,
          }

          // @ts-ignore
          addToast(actionContext, toast)

          expect(actionContext.commit).toHaveBeenCalledTimes(1)
          expect(actionContext.commit).toHaveBeenCalledWith('addToast', toast)

          jest.runAllTimers()

          expect(actionContext.commit).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})
