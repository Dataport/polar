import { getWfsFeatures } from '@polar/lib-get-features'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'
import { denkmaelerWfsService } from '../services'
import { mapConfiguration } from '../mapConfig'

export function navigateToDenkmal(instance, objektId: string) {
  const wfsConfig = mapConfiguration.addressSearch.searchMethods.find(
    ({ type }) => type === 'dish'
  )

  if (!wfsConfig) {
    throw new Error('Client is missing wfsConfig on DISH search method.')
  }
  if (!wfsConfig.queryParameters) {
    throw new Error(
      'Client is missing wfsConfig.queryParameters on DISH search method.'
    )
  }

  getWfsFeatures(null, denkmaelerWfsService.url, objektId, {
    ...wfsConfig.queryParameters.wfsConfiguration,
    useRightHandWildcard: false,
  })
    .then((featureCollection: FeatureCollection) => {
      const { features } = featureCollection
      if (features.length === 0) {
        throw Error(`No features for ID ${objektId} found.`)
      }
      if (features.length > 1) {
        console.warn(
          `@polar/client-dish: More than one feature found for id ${objektId}. Arbitrarily using first-returned.`
        )
      }
      const feature = features[0]
      const geometry = feature.geometry as Exclude<Geometry, GeometryCollection>
      instance.$store.dispatch('plugin/pins/showMarker', {
        coordinates: geometry.coordinates,
        epsg: 'EPSG:25832',
        type: geometry.type,
        clicked: false,
      })
    })
    .catch((error) => {
      console.error('@polar/client-dish', error)
      instance.$store.dispatch('plugin/toast/addToast', {
        type: 'warning',
        text: 'dish.idNotFound',
      })
    })
}
