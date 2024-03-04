import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarModule } from '@polar/lib-custom-types'
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
import { setupWatchers } from './actions/setupWatchers'

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
      searchGeometry({ rootGetters, commit }, feature) {
        const loadingKey = getSearchLoadingKey()
        commit('plugin/loadingIndicator/addLoadingKey', loadingKey, {
          root: true,
        })
        searchGeometry
          .call(
            // TODO figure out
            // @ts-expect-error | the part somehow is the whole
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
        { getters: { featureCollection }, rootGetters: { map } },
        item: TreeViewItem | null
      ) {
        updateVectorLayer(map, featureCollection.features, item)
      },
      fullSearchOnToponym(
        { dispatch, getters: { featureCollection } },
        item: TreeViewItem
      ) {
        const feature = featureCollection.features.find(
          // TODO change after id handling has been modified
          // @ts-expect-error | added locally
          (feature) => feature.title === item.id
        )
        dispatch('searchGeometry', geoJson.readFeature(feature))
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
      }: GeometrySearchState): TreeViewItem[] {
        return makeTreeView(titleLocationFrequency, byCategory)
      },
    },
  }

  return storeModule
}
