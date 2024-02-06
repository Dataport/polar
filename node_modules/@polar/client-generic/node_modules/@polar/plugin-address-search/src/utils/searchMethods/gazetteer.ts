import { FeatureCollection } from 'geojson'
import {
  AdditionalSearchOptions,
  getGazetteerFeatures,
} from '@polar/lib-get-features'
import { GazetteerParameters } from '../../types'
import generateInputQuery from './util/generateInputQuery'

/**
 * @param signal - {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal}
 * @param url - Base url.
 * @param inputValue - Value inserted by the user.
 * @param queryParameters - {@link GazetteerParameters}
 */
export default function (
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: GazetteerParameters
): Promise<FeatureCollection> {
  const options: AdditionalSearchOptions = {
    title: queryParameters.fieldName,
    storedQueryId: queryParameters.storedQueryId,
  }
  if (queryParameters.maxFeatures) {
    options.maxFeatures = queryParameters.maxFeatures
  }

  return getGazetteerFeatures(
    signal,
    url,
    generateInputQuery(queryParameters.fieldName, inputValue),
    queryParameters.version || '2.0.0',
    queryParameters.memberSuffix,
    Array.isArray(queryParameters.namespaces)
      ? queryParameters.namespaces
      : [queryParameters.namespaces],
    queryParameters.epsg,
    options
  )
}
