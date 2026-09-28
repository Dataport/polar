import { PolarModule } from '@polar/lib-custom-types'
import { Stroke, Style } from 'ol/style'

interface BgwGetters {
  info: string[][]
  highlightStyle: Style
}

/*
 * BGW VueX Store Module
 */
const bgwModule: PolarModule<Record<string, never>, BgwGetters> = {
  namespaced: true,
  state: {},
  actions: {
    setupModule({ rootGetters, dispatch }) {
      this.watch(
        () => rootGetters['plugin/gfi/currentProperties'],
        () => dispatch('updateFeatures'),
        { deep: true }
      )
    },
    // handles style side effects
    updateFeatures({ rootGetters, getters }) {
      const currentProperties = rootGetters['plugin/gfi/currentProperties']

      const features = rootGetters.map
        .getLayers()
        .getArray()
        .find((layer) => layer.get('id') === '14001')
        // @ts-expect-error | it exists on its deviations
        ?.getSource()
        .getFeatures()

      features.forEach((feature) =>
        feature.setStyle(
          feature.get('BATHINGWAT') === currentProperties.fid
            ? getters.highlightStyle
            : undefined
        )
      )
    },
  },
  mutations: {},
  getters: {
    info(_, __, ___, rootGetters) {
      // @ts-expect-error | local piggyback
      return (rootGetters.configuration.gfi?.infoFields || []).map(
        ({ key, label }) => [
          label,
          rootGetters['plugin/gfi/currentProperties'][key],
        ]
      )
    },
    highlightStyle(_, __, ___, rootGetters) {
      return new Style({
        stroke: new Stroke(
          // @ts-expect-error | local piggyback
          rootGetters.configuration.gfi?.highlightStyleBadestraende.stroke
        ),
      })
    },
  },
}

export default bgwModule
