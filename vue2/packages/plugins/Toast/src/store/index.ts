import merge from 'lodash.merge'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { Toast, ToastState } from '../types'

export const getInitialState = (): ToastState => ({
  toasts: [],
  types: {
    success: {
      color: undefined,
      icon: undefined,
    },
    warning: {
      color: undefined,
      icon: undefined,
    },
    info: {
      color: undefined,
      icon: undefined,
    },
    error: {
      color: undefined,
      icon: undefined,
    },
  },
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<ToastState, ToastState> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ state, commit, rootGetters }) {
        const pluginConfiguration =
          rootGetters.configuration.toast || getInitialState().types
        const mergedTypes = merge({}, state.types, {
          error: pluginConfiguration.error || {},
          warning: pluginConfiguration.warning || {},
          info: pluginConfiguration.info || {},
          success: pluginConfiguration.success || {},
        })
        commit('setTypes', mergedTypes)
      },
      addToast({ state, commit }, toast: Toast) {
        // use potential overrides from config; always prefer toast-specifics
        const smearedToast: Toast = {
          ...(state.types[toast.type] || {}),
          ...toast,
        }
        commit('addToast', smearedToast)
        if (toast.timeout) {
          if (toast.type !== 'error') {
            setTimeout(() => {
              commit('removeToast', smearedToast)
            }, toast.timeout)
          } else {
            console.warn(
              '@polar/plugin-toast: Timeouts for error messages are disabled, they can only be dismissed manually.'
            )
          }
        }
      },
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
    },
    mutations: {
      setTypes(state, types) {
        state.types = types
      },
      addToast(state, toast) {
        state.toasts = [...state.toasts, toast]
      },
      removeToast(state, toast) {
        state.toasts = state.toasts.filter((t) => t !== toast)
      },
    },
  }

  return storeModule
}
