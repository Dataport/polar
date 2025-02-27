import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
import { Feature } from 'ol'
import {
  GeometrySearchState,
  GeometrySearchGetters,
  TreeViewItem,
} from '../types'
import { searchGeometry } from '../../../utils/coastalGazetteer/searchGeometry'
import { getEmptyFeatureCollection } from '../../../utils/coastalGazetteer/responseInterpreter'
import { makeTreeView } from '../utils/makeTreeView'
import { updateVectorLayer, vectorLayer } from '../utils/vectorDisplay'
import { geoJson } from '../../../utils/coastalGazetteer/common'
import { selectLiterature } from '../../../utils/textLocatorBackend/findLiterature/selectLiterature'
import { searchToponymByLiterature } from '../../../utils/textLocatorBackend/toponymByLiterature'
import { setupTooltip } from './actions/setupTooltip'
import { setupDrawReaction } from './actions/setupDrawReaction'
import { updateFrequencies } from './actions/updateFrequencies'

let counter = 0
const searchLoadingKey = 'geometrySearchLoadingKey'
const getSearchLoadingKey = () => `${searchLoadingKey}-${++counter}`

const getInitialState = (): GeometrySearchState => ({
  featureCollection: getEmptyFeatureCollection(),
  titleLocationFrequency: {},
  byCategory: 'text',
  lastSearch: null,
})

export const makeStoreModule = () => {
  const storeModule: PolarModule<GeometrySearchState, GeometrySearchGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ dispatch, rootGetters: { map } }) {
        // point drawing is initially active by default
        dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('setupDrawReaction')
        dispatch('setupTooltip')
        map.addLayer(vectorLayer)
      },
      setupTooltip,
      setupDrawReaction,
      updateFrequencies,
      searchGeometry({ rootGetters, commit, dispatch }, feature: Feature) {
        const loadingKey = getSearchLoadingKey()
        commit('plugin/loadingIndicator/addLoadingKey', loadingKey, {
          root: true,
        })
        searchGeometry
          .call(
            this,
            feature,
            // @ts-expect-error | added in polar-client.ts locally
            rootGetters.configuration.geometrySearch.url,
            rootGetters.configuration.epsg
          )
          .then((result) => {
            commit('setFeatureCollection', result)
            dispatch('updateFrequencies')
          })
          .finally(() => {
            commit('plugin/loadingIndicator/removeLoadingKey', loadingKey, {
              root: true,
            })
            commit('setLastSearch', 'geometrySearch')
          })
      },
      changeActiveData(
        {
          getters: { featureCollection, titleLocationFrequency },
          rootGetters: { map },
        },
        item: TreeViewItem | null
      ) {
        updateVectorLayer(
          map,
          featureCollection.features,
          item,
          titleLocationFrequency
        )
      },
      fullSearchOnToponym({ dispatch }, item: TreeViewItem) {
        dispatch('searchGeometry', geoJson.readFeature(item.feature))
      },
      async fullSearchLiterature(actionContext, item: TreeViewItem) {
        const titleLocationFrequency = await searchToponymByLiterature(
          // @ts-expect-error | added in polar-client.ts locally
          actionContext.rootGetters.configuration.textLocatorBackendUrl,
          item.id
        )
        selectLiterature.call(this, actionContext, {
          categoryId: 0, // dummy to fit API
          feature: {
            type: 'Feature',
            // fake geom to fit APIs; ignored by custom selectLiterature
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: titleLocationFrequency[item.id].location_frequency,
            id: item.id,
            title: item.name,
          },
        })
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      treeViewItems({
        titleLocationFrequency,
        byCategory,
        featureCollection,
      }: GeometrySearchState): TreeViewItem[] {
        return makeTreeView(
          titleLocationFrequency,
          byCategory,
          featureCollection
        )
      },
    },
  }

  return storeModule
}
