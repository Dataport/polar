import { PolarModule } from '@polar/lib-custom-types'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { ModalState } from '../../types'

export const CONTENT_ENUM = {
  WELCOME: 0,
  HINTS: 1,
  HINTSINTERN: 2,
}

const getInitialState = (): ModalState => ({
  confirmed: false,
  closed: false,
  content: CONTENT_ENUM.WELCOME,
})

const ModalModule: PolarModule<ModalState, ModalState> = {
  namespaced: true,
  state: getInitialState,
  mutations: { ...generateSimpleMutations(getInitialState()) },
  getters: { ...generateSimpleGetters(getInitialState()) },
}

export default ModalModule
