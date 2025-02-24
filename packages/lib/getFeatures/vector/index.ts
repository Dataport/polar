import { rawLayerList } from '@masterportal/masterportalapi'
import { Feature } from 'ol'

const supportedFormats = ['OAF', 'WFS']

export const getVectorFeaturesByBboxRequest = ({
  bbox,
  fetchLayerId,
  projectionCode,
}: {
  bbox: number[]
  fetchLayerId: string
  projectionCode: string
}) => {
  const serviceDefinition = rawLayerList.getLayerWhere({ id: fetchLayerId })
  if (!supportedFormats.includes(serviceDefinition.typ)) {
    throw new Error(
      `@polar/lib-get-features#getVectorFeaturesByBboxRequest: Layer with ID "${fetchLayerId}" of type "${serviceDefinition.typ}" was used to retrieve vector data, but is not within the range of supported types [${supportedFormats}].`
    )
  }

  const [codeName, codeNumber] = projectionCode.split(':')

  const url =
    serviceDefinition.typ === 'OAF'
      ? [
          serviceDefinition.url,
          'collections',
          serviceDefinition.collection,
          `items?f=json&limit=100&bbox=${bbox}&bbox-crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}&crs=http://www.opengis.net/def/crs/${codeName}/0/${codeNumber}`,
        ].join('/')
      : `${serviceDefinition.url}${[
          `?service=${serviceDefinition.typ}`,
          `version=${serviceDefinition.version}`,
          `request=GetFeature`,
          `srsName=${projectionCode}`,
          `typeName=${serviceDefinition.featureType}`,
          `bbox=${bbox},${projectionCode}`,
        ].join('&')}`

  return fetch(url)
}

export const getVectorFeaturesByFeatureRequest = ({
  feature,
  fetchLayerId,
  projectionCode,
}: {
  feature: Feature
  fetchLayerId: string
  projectionCode: string
}) => {
  const bbox = feature.getGeometry()?.getExtent?.()

  if (typeof bbox === 'undefined') {
    throw new Error(
      '@polar/lib-get-features#getVectorFeaturesByFeatureRequest: Given feature had no extent.'
    )
  }

  return getVectorFeaturesByBboxRequest({
    bbox,
    fetchLayerId,
    projectionCode,
  })
}
