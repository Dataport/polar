import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { SelectionObjectState } from '../../types'

const getInitialState = (): SelectionObjectState => ({
  objectId: '',
})

const selectionObjectModule: PolarModule<
  SelectionObjectState,
  SelectionObjectState
> = {
  namespaced: true,
  state: getInitialState,
  mutations: { ...generateSimpleMutations(getInitialState()) },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    renderType: (_, __, ___, rootGetters) => {
      return rootGetters.configuration?.selectionObject?.renderType
        ? rootGetters.configuration.selectionObject.renderType
        : 'iconMenu'
    },
  },
}

export default selectionObjectModule
