import { PolarStore, SelectResultFunction } from '@polar/lib-custom-types'
import { SearchResultSymbols } from '@polar/plugin-address-search'
import { FeatureCollection } from 'geojson'
import { searchCoastalGazetteerByToponym } from '../../coastalGazetteer/searchToponym'
import { sorter } from '../../coastalGazetteer/responseInterpreter'
import { GeometrySearchState } from '../../../plugins/GeometrySearch/types'
import { LiteratureFeature, TitleLocationFrequency } from '../../../types'

// NOTE hits (= feature.properties) and featureCollections are in sync; that is, hits[i] had findings featureCollections[i] in gazetteer
const processLiteratureToponyms = (feature: LiteratureFeature) =>
  function (
    this: PolarStore<GeometrySearchState, GeometrySearchState>,
    featureCollections: FeatureCollection[]
  ) {
    const [featureCollection, titleLocationFrequencyChild] = Object.entries(
      feature.properties
    ).reduce(
      (
        [featureCollection, titleLocationFrequencyChild],
        [toponym, count],
        index
      ) => {
        if (featureCollections[index].features.length) {
          const feature = featureCollections[index].features.sort(
            sorter(toponym, 'title')
          )[0]
          titleLocationFrequencyChild[feature.id || ''] =
            (titleLocationFrequencyChild[feature.id || ''] || 0) + count
          featureCollection.features.push(feature)
        }
        return [featureCollection, titleLocationFrequencyChild]
      },
      [
        { type: 'FeatureCollection', features: [] } as FeatureCollection,
        {} as TitleLocationFrequency['string'],
      ]
    )

    this.commit(
      'plugin/geometrySearch/setFeatureCollection',
      featureCollection,
      { root: true }
    )
    this.commit(
      'plugin/geometrySearch/setTitleLocationFrequency',
      { [feature.title]: titleLocationFrequencyChild },
      { root: true }
    )
    this.dispatch('plugin/iconMenu/openMenuById', 'geometrySearch', {
      root: true,
    })
    this.dispatch('plugin/geometrySearch/changeActiveData', null, {
      root: true,
    })
  }

// change if `satisfies` is ever usable on functions
// eslint-disable-next-line func-style
export const selectLiterature: SelectResultFunction<
  GeometrySearchState,
  GeometrySearchState
> = function (
  this: PolarStore<GeometrySearchState, GeometrySearchState>,
  { commit, rootGetters },
  { feature }
) {
  // default behaviour (AddressSearch selects and is not involved in further behaviour
  commit('plugin/addressSearch/setChosenAddress', null, { root: true })
  commit('plugin/addressSearch/setInputValue', feature.title, { root: true })
  commit(
    'plugin/addressSearch/setSearchResults',
    SearchResultSymbols.NO_SEARCH,
    { root: true }
  )

  Promise.all(
    Object.entries((feature as LiteratureFeature).properties).map(([toponym]) =>
      searchCoastalGazetteerByToponym.call(
        this,
        new AbortController().signal, // dummy, no aborting implemented here
        rootGetters['plugin/addressSearch/searchMethods'].find(
          (searchMethod) => searchMethod.type === 'coastalGazetteer'
        ).url,
        toponym,
        {
          map: rootGetters.map,
          epsg: rootGetters.configuration.epsg,
        }
      )
    )
  )
    .then(processLiteratureToponyms(feature as LiteratureFeature).bind(this))
    .catch(console.error) // search function already printed toasts
}
