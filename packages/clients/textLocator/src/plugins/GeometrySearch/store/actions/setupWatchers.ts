import { PolarStore } from '@polar/lib-custom-types'
import { GeometrySearchGetters, GeometrySearchState } from '../../types'
import { searchLiteratureByToponym } from '../../../../utils/literatureByToponym'

export function setupWatchers(
  this: PolarStore<GeometrySearchState, GeometrySearchGetters>,
  { commit, dispatch, rootGetters }
) {
  // load titleLocationFrequency on each featureCollection update
  this.watch(
    () => rootGetters['plugin/geometrySearch/featureCollection'],
    async (featureCollection) => {
      if (!featureCollection.features.length) {
        dispatch(
          'plugin/toast/addToast',
          {
            type: 'info',
            text: 'textLocator.info.noGeometriesFound',
            timeout: 10000,
          },
          { root: true }
        )
        commit('setTitleLocationFrequency', {})
        return
      }
      const names: string[] = featureCollection.features
        .map((feature) => feature.properties?.names?.map((name) => name.Name))
        .flat(1)
        .filter((x) => x)
      const titleLocationFrequency = await searchLiteratureByToponym(
        rootGetters.configuration.textLocatorBackendUrl,
        names
      )
      commit('setTitleLocationFrequency', titleLocationFrequency)
      if (Object.keys(titleLocationFrequency).length) {
        dispatch('plugin/iconMenu/openMenuById', 'geometrySearch', {
          root: true,
        })
      } else {
        dispatch(
          'plugin/toast/addToast',
          {
            type: 'info',
            text: 'textLocator.info.noLiteratureFound',
            timeout: 10000,
          },
          { root: true }
        )
      }
      dispatch('changeActiveData', null)
    }
  )
}
