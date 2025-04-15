import { PolarActionContext } from '@polar/lib-custom-types'
import { TitleLocationFrequency } from '../../../../types'
import { searchLiteratureByToponym } from '../../../../utils/textLocatorBackend/literatureByToponym'
import { GeometrySearchGetters, GeometrySearchState } from '../../types'

const requestLiteraturePerFeature = (
  featureCollection: GeometrySearchState['featureCollection'],
  textLocatorBackendUrl: string
) =>
  featureCollection.features
    .map((feature) => feature.properties.names.map((name) => name.Name))
    .filter((names) => names.length)
    .map((names) => searchLiteratureByToponym(textLocatorBackendUrl, names))

const aggregateFeatureHitsByLocationOfLiterature = (
  featureCollection: GeometrySearchState['featureCollection'],
  titleLocationFrequencies: TitleLocationFrequency[]
): TitleLocationFrequency =>
  titleLocationFrequencies.reduce((accumulator, current, index) => {
    Object.entries(current).forEach(
      ([literatureId, { title, location_frequency: locationFrequency }]) => {
        accumulator[literatureId] = {
          title,
          location_frequency: {
            ...(accumulator[literatureId]?.location_frequency || {}),
            ...Object.fromEntries(
              Object.entries(locationFrequency).map((entry) => [
                featureCollection.features[index].id as string,
                entry[1] +
                  (locationFrequency[
                    featureCollection.features[index].id as string
                  ] || 0),
              ])
            ),
          },
        }
      }
    )

    return accumulator
  }, {} as TitleLocationFrequency)

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

  const titleLocationFrequency = aggregateFeatureHitsByLocationOfLiterature(
    featureCollection,
    await Promise.all(
      requestLiteraturePerFeature(
        featureCollection,
        // @ts-expect-error | added in polar-client.ts locally
        rootGetters.configuration.textLocatorBackendUrl
      )
    )
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
