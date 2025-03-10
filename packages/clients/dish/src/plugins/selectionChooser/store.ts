import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { SelectionChooserState } from '../../types'

const getInitialState = (): SelectionChooserState => ({
  objectId: 0,
})

const SelectionChooserModule: PolarModule<
  SelectionChooserState,
  SelectionChooserState
> = {
  namespaced: true,
  state: getInitialState,
  mutations: { ...generateSimpleMutations(getInitialState()) },
  getters: { ...generateSimpleGetters(getInitialState()) },
}

export default SelectionChooserModule
