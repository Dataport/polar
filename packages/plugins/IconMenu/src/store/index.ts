import { t } from 'i18next'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { IconMenuGetters, IconMenuState } from '../types'

const getInitialState = (): IconMenuState => ({
  menus: [],
  open: null,
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  const storeModule: PolarModule<IconMenuState, IconMenuGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ commit, dispatch, getters, rootGetters }): void {
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

        // The map initially has a height of 0, so initially opening a menu only works after the height has changed
        this.watch(
          () => rootGetters.mapHasDimensions,
          (value) => {
            if (
              value &&
              !rootGetters.hasSmallHeight &&
              !rootGetters.hasSmallWidth
            ) {
              dispatch('openMenuById', getters.initiallyOpen)
            }
          }
        )
      },
      openMenuById({ commit, dispatch, getters }, openId: string) {
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
                plugin: hint || `plugins.iconMenu.hints.${id}`,
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
      component: (_, __, ___, rootGetters) =>
        rootGetters.configuration.iconMenu?.component || null,
      initiallyOpen: (_, __, ___, rootGetters) =>
        rootGetters.configuration.iconMenu?.initiallyOpen || '',
    },
  }

  return storeModule
}
