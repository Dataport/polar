import Vue from 'vue'
import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import {
  FilterConfigurationTimeOption,
  FilterConfiguration,
  PolarModule,
} from '@polar/lib-custom-types'
import ChooseTimeFrame from '../components/ChooseTimeFrame.vue'
import { FilterGetters, FilterState } from '../types'
import { updateFeatureVisibility } from '../utils/updateFeatureVisibility'

const getInitialState = (): FilterState => ({
  category: {},
  time: {},
})

const arrayOnlyContains = (array, value) =>
  array.reduce((accumulator, current) => accumulator && current === value, true)

const setState = (state, path, value) => {
  if (path.length === 1) {
    Vue.set(state, path[0], value)
    return
  }
  const [step, ...restPath] = path
  if (!state[step]) {
    Vue.set(state, step, {})
  }
  setState(state[step], restPath, value)
}

const parseTimeOption =
  (timeDirection: 'last' | 'next') => (config: FilterConfigurationTimeOption) =>
    config.amounts.map((amount) => ({
      label: `common:plugins.filter.time.${timeDirection}.${config.unit}`,
      component: null,
      amount,
      unit: config.unit,
      now: null,
      type: timeDirection,
    }))

const storeModule: PolarModule<FilterState, FilterGetters> = {
  namespaced: true,
  state: getInitialState(),
  actions: {
    setupModule({ getters: { filterConfiguration }, commit }): void {
      Object.entries(filterConfiguration.layers).forEach(
        ([layerId, { categories, time }]) => {
          categories?.forEach?.(({ targetProperty, knownValues }) => {
            commit('setupState', {
              path: ['category', layerId, targetProperty],
              value: knownValues.reduce((accumulator, current) => {
                accumulator[current] = true
                return accumulator
              }, {}),
            })
          })
          if (time) {
            const { targetProperty, freeSelection, pattern } = time
            commit('setupState', {
              path: ['time', layerId],
              value: {
                targetProperty,
                pattern: pattern || 'YYYY-MM-DD',
                radioId: 0,
                freeSelection: freeSelection ? [] : null,
              },
            })
          }
        }
      )
    },
    toggleCategory({ getters, commit, dispatch }, payload) {
      const value = !getters.getActiveCategory(payload)
      commit('setCategory', { ...payload, value })
      dispatch('updateFeatureVisibility', payload.layerId)
    },
    toggleCategoryAll({ getters, commit, dispatch }, payload) {
      // 'indeterminate' to false intentionally (something had to be decided)
      const value = !getters.getActiveCategoryAll(payload)
      const { layerId } = payload
      // @ts-expect-error | this call only happens if structures exist (generation in .vue)
      getters
        .getCategories(layerId)
        .find(({ targetProperty }) => targetProperty === payload.targetProperty)
        .knownValues.forEach((knownValue) => {
          commit('setCategory', { ...payload, knownValue, value })
        })
      dispatch('updateFeatureVisibility', payload.layerId)
    },
    changeTimeRadio({ commit, dispatch }, payload) {
      commit('setTimeRadio', payload)
      dispatch('updateFeatureVisibility', payload.layerId)
    },
    changeFreeSelection({ commit, dispatch }, { layerId, freeSelection }) {
      commit('setFreeSelection', { layerId, freeSelection })
      dispatch('updateFeatureVisibility', layerId)
    },
    updateFeatureVisibility({ state, rootGetters, getters }, layerId) {
      updateFeatureVisibility({
        map: rootGetters.map,
        layerId,
        categories: getters.getCategories(layerId),
        timeOptions: getters.getTimeOptions(layerId),
        state: JSON.parse(JSON.stringify(state)),
      })
    },
  },
  mutations: {
    ...generateSimpleMutations(getInitialState()),
    setCategory(state, { layerId, targetProperty, knownValue, value }) {
      state.category[layerId][targetProperty][knownValue] = value
    },
    setupState(state, { path, value }) {
      setState(state, path, value)
    },
    setTimeRadio(state, { layerId, radioId }) {
      state.time[layerId].radioId = radioId
    },
    setFreeSelection(state, { layerId, freeSelection }) {
      state.time[layerId].freeSelection = freeSelection
    },
  },
  getters: {
    ...generateSimpleGetters(getInitialState()),
    filterConfiguration(_, __, ___, rootGetters): FilterConfiguration {
      return rootGetters.configuration?.filter || { layers: {} }
    },
    getActiveCategory(state) {
      return ({ layerId, targetProperty, knownValue }) =>
        state.category[layerId][targetProperty][knownValue]
    },
    getActiveCategoryAll(state) {
      return ({ layerId, targetProperty }) => {
        const allValues = Object.values(state.category[layerId][targetProperty])
        if (arrayOnlyContains(allValues, true)) {
          return true
        }
        if (arrayOnlyContains(allValues, false)) {
          return false
        }
        return 'indeterminate'
      }
    },
    getActiveTime(state) {
      return ({ layerId }) => state.time[layerId].radioId
    },
    getCategories(_, getters) {
      return (layerId) =>
        getters.filterConfiguration.layers[layerId]?.categories || []
    },
    getTimeConfig(_, { filterConfiguration }) {
      return (layerId) => filterConfiguration.layers[layerId]?.time || null
    },
    getTimeOptions(_, { getTimeConfig }) {
      return (layerId) => {
        const timeConfig = getTimeConfig(layerId)
        if (!timeConfig) {
          return []
        }
        return [
          ...(timeConfig.last || []).map(parseTimeOption('last')).flat(1),
          ...(timeConfig.next || []).map(parseTimeOption('next')).flat(1),
          ...(!timeConfig.freeSelection
            ? []
            : [
                {
                  label: 'common:plugins.filter.time.chooseTimeFrame.label',
                  component: ChooseTimeFrame,
                  amount: null,
                  unit: timeConfig.freeSelection.unit,
                  now: timeConfig.freeSelection.now,
                  type: 'freeSelection',
                },
              ]),
        ]
      }
    },
    getFreeSelection(state) {
      return (layerId: string) => state.time[layerId].freeSelection
    },
  },
}

export default storeModule
