import { FeatureCollection } from 'geojson'
import { transform as transformCoordinates } from 'ol/proj'
import { BKGParameters } from '../../types'

export default function (
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: BKGParameters
): Promise<FeatureCollection> {
  let requestUrl = `${url}?query=${inputValue.replace(' ', '+')}`
  if (queryParameters) {
    for (const [key, value] of Object.entries(queryParameters).filter(
      ([key]) =>
        key !== 'filter' &&
        key !== 'epsg' &&
        key !== 'apiKey' &&
        key !== 'accessToken'
    )) {
      requestUrl += `&${key}=${value}`
    }
    if (
      queryParameters.filter &&
      Object.keys(queryParameters.filter).length > 0
    ) {
      requestUrl += '&filter='
      requestUrl = Object.entries(queryParameters.filter)
        .reduce((prev, [key, value]) => `${prev + key}:${value}&`, requestUrl)
        .slice(0, -1)
    }
  }
  // TODO: Add proper type for fetch options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = { signal }
  // Note: https://stackoverflow.com/a/45640164/10995014
  // TODO: These parameters should rather be implemented for all search methods instead of only for bkg.
  if (queryParameters.accessToken) {
    // TODO must be legal to match API
    options.headers = { Authorization: `Bearer ${queryParameters.accessToken}` }
  } else if (queryParameters.apiKey) {
    // TODO must be legal to match API
    // NOTE name required as noted
    // eslint-disable-next-line @typescript-eslint/naming-convention
    options.headers = { 'X-Api-Key': queryParameters.apiKey }
  }
  return fetch(encodeURI(requestUrl), options)
    .then((response: Response) => response.json())
    .then((geo) => ({
      ...geo,
      features: geo.features.map((feature) => ({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates:
            queryParameters.epsg === 'EPSG:4326'
              ? feature.geometry.coordinates
              : transformCoordinates(
                  feature.geometry.coordinates,
                  'EPSG:4326',
                  queryParameters.epsg
                ),
        },
        epsg: queryParameters.epsg,
        title: feature.properties.text,
      })),
    }))
}
