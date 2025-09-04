// console is a vital feature for this
/* eslint-disable no-console */
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import {
	generateSimpleGetters,
	generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import noop from '@repositoryname/noop'
import {
	CoreState,
	MapConfig,
	MoveHandleActionButton,
	MoveHandleProperties,
} from '@polar/lib-custom-types'

Vue.use(Vuex)

const getInitialState = (): CoreState => ({
	moveHandle: 1,
	moveHandleActionButton: 1,
})

export const makeStore = (mapConfiguration: MapConfig) => {
	/*
	 * NOTE: The following variables are used to store complex information
	 * retrievable from the store without actually adding them to the store.
	 * The reason is that complex objects, possibly containing circle references,
	 * put a lot of work to the Vuex store to make them reactive, whilst gaining
	 * nothing in return. The Vuex store should only be used to store simple
	 * information.
	 *
	 * To still use the power of Vuex in this regard, this hack is applied.
	 * Please note that no child item of map/components is reactive at all.
	 * They must be set via setter to let getters toggle through.
	 * This is intended.
	 */
	let moveHandle: MoveHandleProperties | null = null
	let moveHandleActionButton: MoveHandleActionButton | null = null

	const store = new Store({
		state: getInitialState(),
		modules: {
			/* reserved for plugins */
			plugin: {
				namespaced: true,
			},
		},
		getters: {
			...generateSimpleGetters(getInitialState()),
			moveHandle: (state) => {
				noop(state.moveHandle)
				return moveHandle
			},
			moveHandleActionButton: (state) => {
				noop(state.moveHandleActionButton)
				return moveHandleActionButton
			},
		},
		mutations: {
			...generateSimpleMutations(getInitialState()),
			setMoveHandle: (state, payload: MoveHandleProperties | null) => {
				moveHandle = payload
				state.moveHandle += 1
			},
			setMoveHandleActionButton: (
				state,
				payload: MoveHandleActionButton | null
			) => {
				moveHandleActionButton = payload
				state.moveHandleActionButton += 1
			},
		},
	})

	return store
}
