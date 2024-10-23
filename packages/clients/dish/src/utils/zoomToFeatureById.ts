import { getWfsFeatures, WfsParameters } from '@polar/lib-get-features'
import { FeatureCollection, Geometry, GeometryCollection } from 'geojson'

export function zoomToFeatureById(
  instance,
  objektId: string,
  serviceUrl: string,
  parameters: WfsParameters
) {
  getWfsFeatures(null, serviceUrl, objektId, parameters)
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
        text: 'common:dish.idNotFound',
      })
    })
}
