import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import * as olProj from 'ol/proj'
import { t as translate } from 'i18next'
import { PolarModule } from '@polar/lib-custom-types'
import thousandsSeparator from '../utils/thousandsSeperator'
import beautifyScale from '../utils/beautifyScale'
import getDpi from '../utils/getDpi'
import { ScaleState } from '../types'

const getInitialState = (): ScaleState => ({
  scaleValue: 0,
  scaleToOne: '',
  scaleWithUnit: '',
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
export const makeStoreModule = () => {
  const storeModule: PolarModule<ScaleState, ScaleState> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ rootGetters: { map }, dispatch }): void {
        map.on('moveend', () => dispatch('getScale'))
      },
      /**
       * gets the current scale and sets it to the state variable scaleValue
       */
      getScale({ rootGetters: { map }, commit, dispatch }): void {
        const unit = map.getView().getProjection().getUnits()
        const resolution: number = map.getView().getResolution() as number
        const inchesPerMetre = 39.37
        const scale: number = Math.round(
          resolution * olProj.METERS_PER_UNIT[unit] * inchesPerMetre * getDpi()
        )

        commit('setScaleValue', scale)
        dispatch('scaleWithUnit')
        dispatch('scaleToOne')
      },
      /**
       * generates a beautified state in format "1 : scale" where scale is rounded based on its value
       */
      scaleToOne({ getters, commit }): string | void {
        let currentScaleValue = getters.scaleValue
        if (typeof currentScaleValue !== 'number' || currentScaleValue <= 0) {
          return `1 : ${translate('common:plugins.scale.toOneNegative')}`
        }
        currentScaleValue = beautifyScale(currentScaleValue)

        const scaleToOne = '1 : ' + thousandsSeparator(currentScaleValue)
        commit('setScaleToOne', scaleToOne)
      },
      /**
       * generates a beautified scale with a km or m unit
       */
      scaleWithUnit({ getters, commit }): void {
        const scaleNumber = Math.round(0.02 * getters.scaleValue)

        const newValue =
          scaleNumber >= 1000
            ? `${Math.round(scaleNumber / 100) / 10} km`
            : `${scaleNumber} m`
        commit('setScaleWithUnit', newValue)
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      zoomOptions: (_, __, ___, rootGetters) => {
        const options = rootGetters.configuration.options

        if (!options) {
          console.error(
            "@polar/plugin-scale: Configuration parameter `options` is missing. Scale switcher won't be rendered."
          )
          return []
        }
        return options
      },
      showScaleSwitcher: (_, __, ___, rootGetters) => {
        return rootGetters.configuration?.scale?.showScaleSwitcher
      },
    },
  }

  return storeModule
}
