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

const storeModule: PolarModule<IconMenuState, IconMenuState> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    setupModule({ commit, rootGetters }): void {
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
      const index = initializedMenus.findIndex(({ id }) => id === initiallyOpen)
      if (index !== -1) {
        commit('setOpen', index)
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

export default storeModule
