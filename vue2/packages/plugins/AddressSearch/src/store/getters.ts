import { generateSimpleGetters } from '@repositoryname/vuex-generators'
import { PolarGetterTree } from '@polar/lib-custom-types'
import { AddressSearchGetters, AddressSearchState } from '../types'
import { getInitialState } from './state'

const getters: PolarGetterTree<AddressSearchState, AddressSearchGetters> = {
	...generateSimpleGetters(getInitialState()),
	focusAfterSearch: (_, __, ___, rootGetters) =>
		rootGetters.configuration?.addressSearch?.focusAfterSearch || false,
}

export default getters
