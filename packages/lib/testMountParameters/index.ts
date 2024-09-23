import { createLocalVue } from '@vue/test-utils'
import i18next from 'i18next'
import Vue from 'vue'
import VueI18Next from 'i18next-vue'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import { VueConstructor } from 'vue/types/umd'
import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'

Vue.use(VueI18Next, { i18next })
Vue.use(Vuetify)
Vue.use(Vuex)

export interface MockParameters {
  localVue: VueConstructor<Vue>
  store: PolarStore<CoreState, CoreGetters>
  vuetify: Vuetify
  emptyRoot: CoreState
}

const initializeI18n = (): Promise<void> =>
  i18next
    .init({
      lng: 'cimode',
      debug: false,
    })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info(`i18next: Successfully initialized for testing.`)
    })
    .catch((error: Error) => {
      console.error('i18next: Error while initializing for testing.', error)
    })

export default (): MockParameters => {
  initializeI18n()
  const localVue: VueConstructor<Vue> = createLocalVue()
  return {
    localVue,
    vuetify: new Vuetify(),
    store: new Store({
      modules: {
        plugin: {
          namespaced: true,
        },
      },
      getters: {
        // Base value. Should be adjusted in tests if necessary for the test.
        hasSmallDisplay: () => false,
        hasSmallHeight: () => false,
      },
    }),
    emptyRoot: {
      map: 1,
      clientHeight: 0,
      clientWidth: 0,
      center: null,
      components: 1,
      configuration: {
        epsg: 'EPSG:12345',
        layerConf: [],
        namedProjections: [],
        layers: [],
        options: [],
      },
      errors: [],
      hasSmallDisplay: false,
      moveHandle: 0,
      moveHandleActionButton: 0,
      plugin: {},
      language: '',
      mapHasDimensions: false,
      zoomLevel: 0,
      hovered: 0,
      selected: 0,
    },
  }
}
