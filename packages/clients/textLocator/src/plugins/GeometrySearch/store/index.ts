import {
  generateSimpleGetters,
  generateSimpleMutations,
} from '@repositoryname/vuex-generators'
import { PolarActionHandler, PolarModule } from '@polar/lib-custom-types'
import debounce from 'lodash.debounce'
import { Feature } from 'ol'
import VectorSource, { VectorSourceEvent } from 'ol/source/Vector'
import { GeometrySearchState, GeometrySearchGetters } from '../types'
import { searchGeometry } from '../../../utils/coastalGazetteer/searchGeometry'
import { getEmptyFeatureCollection } from '../../../utils/coastalGazetteer/responseInterpreter'
import { searchLiteratureByToponym } from '../../../utils/literatureByToponym'

interface TreeViewItem {
  id: string
  name: string
  count: number
  children?: TreeViewItem[]
}

let counter = 0
const searchLoadingKey = 'geometrySearchLoadingKey'
const getSearchLoadingKey = () => `${searchLoadingKey}-${++counter}`

const getInitialState = (): GeometrySearchState => ({
  featureCollection: getEmptyFeatureCollection(),
  titleLocationFrequency: {},
  draw: 'Point',
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
        // initially, point drawing is active
        dispatch('setDrawMode', 'Point')
        dispatch('setupDrawReaction')
        dispatch('setupWatchers')
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
          async () => {
            const names: string[] = rootGetters[
              'plugin/geometrySearch/featureCollection'
            ].features
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
            }
          },
          { immediate: false }
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
      setDrawMode({ commit, dispatch }, drawMode): void {
        dispatch('plugin/draw/setMode', 'draw', { root: true })
        dispatch('plugin/draw/setDrawMode', drawMode, { root: true })
        commit('plugin/geometrySearch/setDraw', drawMode, { root: true })
      },
    },
    mutations: {
      ...generateSimpleMutations(getInitialState()),
    },
    getters: {
      ...generateSimpleGetters(getInitialState()),
      // TODO
      // eslint-disable-next-line max-lines-per-function
      treeViewItems({
        titleLocationFrequency,
        byCategory,
      }: GeometrySearchState): TreeViewItem[] {
        const byTextTreeViewItems: TreeViewItem[] = Object.entries(
          titleLocationFrequency
        ).map(([title, locations]) => ({
          id: title,
          name: title,
          count: Object.values(locations).reduce((acc, curr) => acc + curr),
          children: Object.entries(locations).map(([location, count]) => ({
            id: location,
            name: location,
            count,
          })),
        }))

        if (byCategory === 'text') {
          return byTextTreeViewItems
        }

        /*
interface TreeViewItem {
  id: string
  name: string
  children?: TreeViewItem[]
}
        */

        const locationNames = [
          ...new Set(
            byTextTreeViewItems
              .map((item) =>
                (item.children || []).map((child) => child.name).flat(1)
              )
              .flat(1)
          ),
        ]

        console.warn(locationNames)

        return locationNames.map((locationName) => ({
          id: locationName,
          name: locationName,
          count: byTextTreeViewItems
            .map(
              (item) =>
                item.children?.find((child) => child.name === locationName)
                  ?.count || 0
            )
            .reduce((acc, curr) => acc + curr),
          children: byTextTreeViewItems
            .filter((item) =>
              item.children?.find((child) => child.name === locationName)
            )
            .map((item) => ({ ...item, children: undefined })),
        }))
      },
    },
  }

  return storeModule
}
