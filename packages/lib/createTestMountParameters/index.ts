import { createLocalVue } from '@vue/test-utils'
import i18next from 'i18next'
import Vue from 'vue'
import VueI18Next from '@panter/vue-i18next'
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import { VueConstructor } from 'vue/types/umd'
import { CoreGetters, CoreState, PolarStore } from '@polar/lib-custom-types'

Vue.use(VueI18Next)
Vue.use(Vuetify)
Vue.use(Vuex)

export interface MockParameters {
  i18n: VueI18Next
  localVue: VueConstructor<Vue>
  store: PolarStore<CoreState, CoreGetters>
  vuetify: Vuetify
  emptyRoot: CoreState
}

export default (): MockParameters => {
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
  const localVue: VueConstructor<Vue> = createLocalVue()
  return {
    localVue,
    i18n: new VueI18Next(i18next),
    vuetify: new Vuetify(),
    store: new Store({
      modules: {
        plugin: {
          namespaced: true,
        },
      },
    }),
    emptyRoot: {
      map: 1,
      clientHeight: 0,
      clientWidth: 0,
      center: null,
      components: 1,
      configuration: {
        epsg: '',
        namedProjections: [],
        layers: [],
        options: [],
      },
      errors: [],
      plugin: {},
      zoomLevel: 0,
      hovered: 0,
      selected: 0,
    },
  }
}
