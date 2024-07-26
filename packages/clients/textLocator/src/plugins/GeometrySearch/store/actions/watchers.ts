import { PolarActionContext, PolarStore } from '@polar/lib-custom-types'
import { GeometrySearchGetters, GeometrySearchState } from '../../types'
import {
  TitleLocationFrequency,
  searchLiteratureByToponym,
} from '../../../../utils/literatureByToponym'

export function setupWatchers(
  this: PolarStore<GeometrySearchState, GeometrySearchGetters>,
  {
    dispatch,
    rootGetters,
  }: PolarActionContext<GeometrySearchState, GeometrySearchGetters>
) {
  // load titleLocationFrequency on each featureCollection update
  this.watch(
    () => rootGetters['plugin/geometrySearch/featureCollection'],
    () => dispatch('updateFrequencies')
  )
}

const requestLiteraturePerFeature = (
  featureCollection: GeometrySearchState['featureCollection'],
  textLocatorBackendUrl: string
) =>
  featureCollection.features
    .map((feature) => feature.properties.names.map((name) => name.Name))
    .filter((names) => names.length)
    .map((names) => searchLiteratureByToponym(textLocatorBackendUrl, names))

const aggregatePerFeatureId =
  (featureCollection: GeometrySearchState['featureCollection']) =>
  (
    featureFrequency: TitleLocationFrequency,
    index: number
  ): TitleLocationFrequency =>
    Object.fromEntries(
      Object.entries(featureFrequency).map(([literatureTitle, frequency]) => [
        literatureTitle,
        {
          [featureCollection.features[index].id as string]: Object.values(
            frequency
          ).reduce((accumulator, current) => accumulator + current, 0),
        },
      ])
    )

const flattenFrequencies = (
  accumulator: TitleLocationFrequency,
  current: TitleLocationFrequency
) => {
  Object.entries(current).forEach(([title, findings]) => {
    accumulator[title] = {
      ...(accumulator[title] || {}),
      ...findings,
    }
  })
  return accumulator
}

export async function updateFrequencies({
  commit,
  dispatch,
  getters: { featureCollection },
  rootGetters,
}: PolarActionContext<GeometrySearchState, GeometrySearchGetters>) {
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
    dispatch('changeActiveData', null)
    return
  }
  const titleLocationFrequency = (
    await Promise.all(
      requestLiteraturePerFeature(
        featureCollection,
        // @ts-expect-error | added in polar-client.ts locally
        rootGetters.configuration.textLocatorBackendUrl
      )
    )
  )
    .map(aggregatePerFeatureId(featureCollection))
    .reduce(flattenFrequencies, {})

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
