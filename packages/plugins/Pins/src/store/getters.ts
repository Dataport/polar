import { PolarGetterTree } from '@polar/lib-custom-types'
import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { PinsGetters, PinsState } from '../types'
import { getInitialState } from './state'

const getters: PolarGetterTree<PinsState, PinsGetters> = {
  ...generateSimpleGetters(getInitialState()),
  toZoomLevel(_, __, ___, rootGetters) {
    return (rootGetters.configuration.pins || {}).toZoomLevel || 0
  },
  atZoomLevel(_, __, ___, rootGetters) {
    return (
      (rootGetters.configuration.pins || {}).appearOnClick?.atZoomLevel || 0
    )
  },
}

export default getters
