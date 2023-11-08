import { search, setGazetteerUrl } from '@masterportal/masterportalapi'
import { transform as transformCoordinates } from 'ol/proj'
import { FeatureCollection, Feature } from 'geojson'
import { MpApiParameters } from '../../types'

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
    const results = await search(input, {
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

    const firstResult = results[0]
    const srsName = firstResult.properties.position.Point[0].$.srsName

    let featureEPSG

    if (srsName.includes('::')) {
      // Case 1 example: "urn:ogc:def:crs:EPSG::25832"
      const parts = srsName.split('::')

      featureEPSG = `EPSG:${parts[1]}`
    } else if (srsName.includes(':')) {
      // Case 2 example: "EPSG:25832"
      featureEPSG = srsName
    } else {
      console.error('Unknown formatting of projection:', srsName)
    }

    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: mapFeatures(results, signal, queryParameters.epsg, featureEPSG),
    }

    return featureCollection
  } catch (error) {
    console.error(error)
    throw new Error('An error occurred while fetching the feature collection.')
  }
}
