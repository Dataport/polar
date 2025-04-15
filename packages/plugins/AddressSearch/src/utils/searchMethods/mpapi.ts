import { search, setGazetteerUrl } from '@masterportal/masterportalapi'
import { Feature, FeatureCollection } from 'geojson'
import { transform as transformCoordinates } from 'ol/proj'
import { MpApiParameters } from '../../types'

const getFeatureEPSG = (srsName: string): string => {
  if (srsName.includes('::')) {
    // Case 1 example: "urn:ogc:def:crs:EPSG::25832"
    const parts = srsName.split('::')

    return `EPSG:${parts[1]}`
  } else if (srsName.includes(':')) {
    // Case 2 example: "EPSG:25832"
    return srsName
  }
  console.error(
    '@polar/plugin-address-search: Unknown formatting of projection:',
    srsName
  )
  throw Error('Unknown formatting of projection: ' + srsName)
}

const mapFeatures = (
  results,
  signal: AbortSignal,
  queryEpsg: string,
  featureEpsg: string
): Feature[] =>
  results.map((result) => {
    const { name, geometry } = result
    const coordsAsIntegers = [
      parseInt(geometry.coordinates[0]),
      parseInt(geometry.coordinates[1]),
    ]
    const transformedCoordinates =
      featureEpsg === queryEpsg
        ? coordsAsIntegers
        : transformCoordinates(coordsAsIntegers, featureEpsg, queryEpsg)

    return {
      ...result,
      signal,
      title: name,
      epsg: featureEpsg,
      geometry: {
        ...geometry,
        coordinates: transformedCoordinates,
      },
    }
  })

export default async function (
  signal: AbortSignal,
  url: string,
  input: string,
  queryParameters: MpApiParameters
): Promise<FeatureCollection> {
  setGazetteerUrl(url)

  try {
    let results = await search(input, {
      ...queryParameters,
      searchStreetBeforeWord: false,
      // always trigger search – control done on a higher level as minLength
      minCharacters: 0,
    })

    // If no results were found without using the wildcard, try again with the wildcard
    if (results.length === 0) {
      results = await search(input, {
        ...queryParameters,
        // always trigger search – control done on a higher level as minLength
        minCharacters: 0,
      })
      if (results.length === 0) {
        return {
          type: 'FeatureCollection',
          features: [],
        }
      }
    }

    const firstResult = results[0]
    const srsName = firstResult.properties.position.Point[0].$.srsName

    const featureEPSG = getFeatureEPSG(srsName)

    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: mapFeatures(results, signal, queryParameters.epsg, featureEPSG),
    }

    return featureCollection
  } catch (error) {
    console.error('@polar/plugin-address-search', error)
    throw new Error('An error occurred while fetching the feature collection.')
  }
}
