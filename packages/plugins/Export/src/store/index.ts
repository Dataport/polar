import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { ExportDirection, ExportGetters, ExportState } from '../types'
import actions from './actions'

const getInitialState = (): ExportState => ({
  exportedMap: '',
  openInDirection: ExportDirection.RIGHT,
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<ExportState, ExportGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions,
    getters: {
      ...generateSimpleGetters(getInitialState()),
      configuration(_, __, ___, rootGetters) {
        return {
          download: false,
          showJpg: true,
          showPdf: true,
          showPng: true,
          ...rootGetters.configuration?.export,
        }
      },
      download(_, { configuration }) {
        return configuration.download
      },
      showJpg(_, { configuration }) {
        return configuration.showJpg
      },
      showPng(_, { configuration }) {
        return configuration.showPng
      },
      showPdf(_, { configuration }) {
        return configuration.showPdf
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
  }

  return storeModule
}
