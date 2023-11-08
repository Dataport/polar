import { FeatureCollection } from 'geojson'
import { MemberSuffix } from '@polar/lib-custom-types'
import { AdditionalSearchOptions, SearchParameters, WFSVersion } from '../types'
import { errorCheck } from '../utils/errorCheck'
import { parseGazetteerResponse } from './parse'

/**
 * Sends a GetFeature request to a WFS-service and parses the response.
 *
 * @param signal - {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal}
 * @param url - Base url.
 * @param input - {@link SearchParameters}
 * @param version - {@link WFSVersion}
 * @param memberSuffix - {@link MemberSuffix}
 * @param namespaces - The namespaces of the features of the WFS-G service.
 * @param epsg - The projection code of the map.
 * @param options - {@link AdditionalSearchOptions}
 */
export function getGazetteerFeatures(
  signal: AbortSignal,
  url: string,
  input: SearchParameters,
  version: WFSVersion,
  memberSuffix: MemberSuffix,
  namespaces: string[],
  epsg: string,
  options: AdditionalSearchOptions = {}
): Promise<FeatureCollection> {
  let requestUrl = Object.entries(input).reduce(
    (acc, curr) => `${acc}&${curr[0]}=${curr[1]}`,
    `${url}?service=WFS&request=GetFeature&version=${version}`
  )
  requestUrl += !options.maxFeatures
    ? ''
    : `&${version === '2.0.0' ? 'count' : 'maxFeatures'}=${options.maxFeatures}`
  requestUrl += options.storedQueryId
    ? `&StoredQuery_ID=${options.storedQueryId}`
    : ''

  return fetch(encodeURI(requestUrl), { signal }).then((response: Response) => {
    errorCheck(response)
    return parseGazetteerResponse(
      response,
      memberSuffix,
      namespaces,
      epsg,
      options?.title
    )
  })
}
