import { t } from 'i18next'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { IconMenuState } from '../types'

const getInitialState = (): IconMenuState => ({
  menus: [],
  open: null,
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  const storeModule: PolarModule<IconMenuState, IconMenuState> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ commit, dispatch, rootGetters }): void {
        const menus = rootGetters.configuration?.iconMenu?.menus || []
        const initializedMenus = menus
          .filter(({ id }) => {
            const display = rootGetters.configuration?.[id]?.displayComponent
            return typeof display === 'boolean' ? display : true
          })
          .map((menu) => {
            let plugin
            const fakeVm = {
              $store: {
                ...this,
                dispatch: (name, payload) => {
                  this.dispatch(name, payload)
                  plugin = payload.plugin
                },
              },
            }
            // @ts-expect-error | Issue 'TS2349: This expression is not callable. Type '{}' has no call signatures.' Arises as noted in @polar/lib-custom-types
            menu.plugin(fakeVm)
            return {
              ...menu,
              plugin,
            }
          })

        commit('setMenus', initializedMenus)

        const initiallyOpen =
          rootGetters.configuration?.iconMenu?.initiallyOpen || ''

        if (!rootGetters.hasSmallWidth && !rootGetters.hasSmallHeight) {
          dispatch('openMenuById', initiallyOpen)
        }
      },
      openMenuById({ commit, getters, dispatch }, openId) {
        const index = getters.menus.findIndex(({ id }) => id === openId)

        if (index !== -1) {
          commit('setOpen', index)
          dispatch('openInMoveHandle', index)
        }
      },
      openInMoveHandle({ commit, getters, rootGetters }, index: number) {
        if (rootGetters.hasWindowSize && rootGetters.hasSmallWidth) {
          const { hint, id, plugin } = getters.menus[index]
          commit(
            'setMoveHandle',
            {
              closeLabel: t('plugins.iconMenu.mobileCloseButton', {
                plugin: hint || `common:plugins.iconMenu.hints.${id}`,
              }),
              closeFunction: () => commit('setOpen', null),
              component: plugin,
              plugin: 'iconMenu',
            },
            { root: true }
          )
        }
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
    },
  }

  return storeModule
}
