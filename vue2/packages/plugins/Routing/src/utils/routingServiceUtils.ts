import i18next from 'i18next'
import { transform } from 'ol/proj'

async function fetchRoutingDirections(
  url: string,
  searchCoordinates: number[][],
  selectedRouteTypesToAvoid: string[],
  selectedPreference: string,
  apiKey: string
) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': 'application/json',
      Authorization: apiKey,
      /* eslint-enable @typescript-eslint/naming-convention */
    },
    body: JSON.stringify({
      coordinates: searchCoordinates,
      geometry: true,
      instructions: true,
      language: i18next.language,
      options: {
        avoid_features: selectedRouteTypesToAvoid,
      },
      preference: selectedPreference,
      units: 'm',
    }),
  })
  if (!response.ok) {
    throw new Error('Route could not be determined. Try different coordinates.')
  }
  return response
}

/**
 * Transforms a coordinate from a given EPSG system to WGS84 (EPSG:4326).
 *
 * @param coordinate - The coordinate to be transformed.
 * @param sourceEpsg - The source EPSG code (e.g., "EPSG:3857").
 * @returns The transformed coordinate in WGS84 format.
 */
function transformCoordinateToWGS84(
  coordinate: number[],
  sourceEpsg: string
): number[] {
  if (!sourceEpsg) {
    throw new Error('Source EPSG code is required')
  }

  return transform(coordinate, sourceEpsg, 'EPSG:4326')
}

export { fetchRoutingDirections, transformCoordinateToWGS84 }
