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
import { setupTooltip } from './actions/setupTooltip'
import { setupDrawReaction } from './actions/setupDrawReaction'
import { setupWatchers, updateFrequencies } from './actions/watchers'

let counter = 0
const searchLoadingKey = 'geometrySearchLoadingKey'
const getSearchLoadingKey = () => `${searchLoadingKey}-${++counter}`

const getInitialState = (): GeometrySearchState => ({
  featureCollection: getEmptyFeatureCollection(),
  titleLocationFrequency: {},
  byCategory: 'text',
})

// OK for module creation
// eslint-disable-next-line max-lines-per-function
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
        // register watchers after store is ready (else immediate-like firing on not-really change)
        setTimeout(() => dispatch('setupWatchers'), 0)
      },
      setupTooltip,
      setupDrawReaction,
      setupWatchers,
      updateFrequencies,
      searchGeometry({ rootGetters, commit }, feature: Feature) {
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
          .then((result) => commit('setFeatureCollection', result))
          .finally(() =>
            commit('plugin/loadingIndicator/removeLoadingKey', loadingKey, {
              root: true,
            })
          )
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
      fullSearchLiterature({ dispatch }) {
        dispatch(
          'plugin/toast/addToast',
          {
            type: 'info',
            text: 'common:textLocator.notImplemented',
            timeout: 5000,
          },
          { root: true }
        )
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
