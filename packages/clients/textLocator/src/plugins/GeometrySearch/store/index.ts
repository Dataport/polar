import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarActionHandler, PolarModule } from '@polar/lib-custom-types'
import debounce from 'lodash.debounce'
import { Feature } from 'ol'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector'
import {
  GeometrySearchState,
  GeometrySearchGetters,
  TreeViewItem,
} from '../types'
import { searchGeometry } from '../../../utils/coastalGazetteer/searchGeometry'
import { getEmptyFeatureCollection } from '../../../utils/coastalGazetteer/responseInterpreter'
import { searchLiteratureByToponym } from '../../../utils/literatureByToponym'
import { makeTreeView } from '../../../utils/makeTreeView'

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
  let debouncedSearchGeometry: PolarActionHandler<
    GeometrySearchState,
    GeometrySearchGetters
  >

  const storeModule: PolarModule<GeometrySearchState, GeometrySearchGetters> = {
    namespaced: true,
    state: getInitialState(),
    actions: {
      setupModule({ dispatch }): void {
        // point drawing is initially active by default
        dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('setupDrawReaction')
        // register watchers after store is ready (else immediate-like firing)
        setTimeout(() => dispatch('setupWatchers'), 0)
      },
      setupDrawReaction({ rootGetters }): void {
        // features added multiple times; avoid overly requesting
        debouncedSearchGeometry = debounce(
          (feature) =>
            this.dispatch('plugin/geometrySearch/searchGeometry', feature),
          20
        ).bind(this)

        // only keep a single feature in the draw tool
        const drawSource = rootGetters['plugin/draw/drawSource'] as VectorSource
        let lastFeature: Feature | undefined
        drawSource.on(['addfeature'], function (event) {
          const nextFeature = (event as VectorSourceEvent).feature
          if (nextFeature && lastFeature !== nextFeature) {
            lastFeature = nextFeature
            drawSource.clear()
            drawSource.addFeature(nextFeature)
            // TODO confusing, figure out
            // @ts-expect-error | The function is bound, the error seems not to apply
            debouncedSearchGeometry(nextFeature)
          }
        })
      },
      setupWatchers({ commit, dispatch, rootGetters }): void {
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
              .map((feature) =>
                feature.properties?.names?.map((name) => name.Name)
              )
              .flat(1)
              .filter((x) => x)
            const titleLocationFrequency = await searchLiteratureByToponym(
              // @ts-expect-error | local addition
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
          }
        )
      },
      searchGeometry({ rootGetters, commit }, feature): void {
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
      // TODO remove on implementing
      // eslint-disable-next-line no-empty-pattern
      changeActiveData({}, activeSlotIds: string[]) {
        console.warn('NOT IMPLEMENTED', activeSlotIds)
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
