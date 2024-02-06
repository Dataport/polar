import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { FilterConfiguration, PolarModule } from '@polar/lib-custom-types'
import ChooseTimeFrame from '../components/ChooseTimeFrame.vue'
import {
  FilterGetters,
  FilterState,
  KnownValue,
  LayerId,
  TargetProperty,
} from '../types'
import { updateFeatureVisibility } from '../utils/updateFeatureVisibility'
import { setState } from '../utils/setState'
import { arrayOnlyContains } from '../utils/arrayOnlyContains'
import { parseTimeOption } from '../utils/parseTimeOption'

const getInitialState = (): FilterState => ({
  category: {},
  time: {},
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  const storeModule: PolarModule<FilterState, FilterGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ getters: { filterConfiguration }, commit }): void {
        Object.entries(filterConfiguration.layers).forEach(
          ([layerId, { categories, time }]) => {
            if (categories) {
              categories.forEach(({ targetProperty, knownValues }) =>
                commit('setupState', {
                  path: ['category', layerId, targetProperty],
                  value: knownValues.reduce((accumulator, current) => {
                    accumulator[current] = true
                    return accumulator
                  }, {}),
                })
              )
            }
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
      toggleCategory(
        { getters, commit, dispatch },
        payload: {
          layerId: LayerId
          targetProperty: TargetProperty
          knownValue: KnownValue
        }
      ) {
        const value = !getters.getActiveCategory(payload)
        commit('setCategory', { ...payload, value })
        dispatch('updateFeatureVisibility', payload.layerId)
      },
      toggleCategoryAll(
        { getters, commit, dispatch },
        payload: {
          layerId: LayerId
          targetProperty: TargetProperty
        }
      ) {
        // 'indeterminate' to false intentionally (something had to be decided)
        const value = !getters.getActiveCategoryAll(payload)
        const { layerId } = payload
        // @ts-expect-error | this call only happens if structures exist (generation in .vue)
        getters
          .getCategories(layerId)
          .find(
            ({ targetProperty }) => targetProperty === payload.targetProperty
          )
          .knownValues.forEach((knownValue) => {
            commit('setCategory', { ...payload, knownValue, value })
          })
        dispatch('updateFeatureVisibility', payload.layerId)
      },
      changeTimeRadio(
        { commit, dispatch },
        payload: { layerId: LayerId; radioId: number }
      ) {
        commit('setTimeRadio', payload)
        dispatch('updateFeatureVisibility', payload.layerId)
      },
      changeFreeSelection(
        { commit, dispatch },
        { layerId, freeSelection }: { layerId: LayerId; freeSelection: Date[] }
      ) {
        commit('setFreeSelection', { layerId, freeSelection })
        dispatch('updateFeatureVisibility', layerId)
      },
      updateFeatureVisibility(
        { state, rootGetters, getters },
        layerId: LayerId
      ) {
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
      setCategory(
        state,
        {
          layerId,
          targetProperty,
          knownValue,
          value,
        }: {
          layerId: LayerId
          targetProperty: TargetProperty
          knownValue: KnownValue
          value: boolean
        }
      ) {
        state.category[layerId][targetProperty][knownValue] = value
      },
      setupState(state, { path, value }: { path: string[]; value: boolean }) {
        setState(state, path, value)
      },
      setTimeRadio(
        state,
        { layerId, radioId }: { layerId: LayerId; radioId: number }
      ) {
        state.time[layerId].radioId = radioId
      },
      setFreeSelection(
        state,
        { layerId, freeSelection }: { layerId: LayerId; freeSelection: Date[] }
      ) {
        state.time[layerId].freeSelection = freeSelection
      },
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      filterConfiguration(_, __, ___, rootGetters): FilterConfiguration {
        return rootGetters.configuration?.filter || { layers: {} }
      },
      getActiveCategory:
        (state) =>
        ({ layerId, targetProperty, knownValue }) =>
          state.category[layerId][targetProperty][knownValue],
      getActiveCategoryAll:
        (state) =>
        ({ layerId, targetProperty }) => {
          const allValues = Object.values(
            state.category[layerId][targetProperty]
          )
          if (arrayOnlyContains(allValues, true)) {
            return true
          }
          if (arrayOnlyContains(allValues, false)) {
            return false
          }
          return 'indeterminate'
        },
      getActiveTime:
        (state) =>
        ({ layerId }) =>
          state.time[layerId].radioId,
      getCategories: (_, getters) => (layerId) =>
        getters.filterConfiguration.layers[layerId]?.categories || [],
      getTimeConfig:
        (_, { filterConfiguration }) =>
        (layerId) =>
          filterConfiguration.layers[layerId]?.time || null,
      getTimeOptions:
        (_, { getTimeConfig }) =>
        (layerId) => {
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
                    unit: timeConfig.freeSelection.unit || 'days',
                    now: timeConfig.freeSelection.now,
                    type: 'freeSelection',
                  },
                ]),
          ]
        },
      getFreeSelection: (state) => (layerId: string) =>
        state.time[layerId].freeSelection,
    },
  }

  return storeModule
}
