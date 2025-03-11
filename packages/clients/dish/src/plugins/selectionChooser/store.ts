import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { SelectionObjectState } from '../../types'

const getInitialState = (): SelectionObjectState => ({
  objectId: 0,
})

const selectionObjectModule: PolarModule<
  SelectionObjectState,
  SelectionObjectState
> = {
  namespaced: true,
  state: getInitialState,
  mutations: { ...generateSimpleMutations(getInitialState()) },
  getters: { ...generateSimpleGetters(getInitialState()) },
}

export default selectionObjectModule
