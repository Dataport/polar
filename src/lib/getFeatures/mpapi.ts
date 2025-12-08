import { search, setGazetteerUrl } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'
import type { FeatureCollection, Feature } from 'geojson'
import { transform } from 'ol/proj'
import type { MpapiParameters, MpapiResult } from './types'

export default async function (
	signal: AbortSignal,
	url: string,
	input: string,
	queryParameters: MpapiParameters
): Promise<FeatureCollection> {
	setGazetteerUrl(url)

	try {
		const baseQueryParameters = toMerged(
			queryParameters,
			// always trigger search – control done on a higher level as minLength
			{ minCharacters: 0 }
		)
		let results = (await search(
			input,
			toMerged(baseQueryParameters, { searchStreetBeforeWord: false })
		)) as MpapiResult[]

		// If no results were found without using the wildcard, try again with the wildcard
		if (results.length === 0) {
			results = (await search(input, baseQueryParameters)) as MpapiResult[]
			if (results.length === 0) {
				return {
					type: 'FeatureCollection',
					features: [],
				}
			}
		}

		return {
			type: 'FeatureCollection',
			features: mapFeatures(
				results,
				signal,
				queryParameters.epsg,
				getFeatureEPSG(results[0].properties.position.Point[0].$.srsName)
			),
		}
	} catch (error) {
		console.error(error)
		throw new Error('An error occurred while fetching the feature collection.')
	}
}

function getFeatureEPSG(srsName: string) {
	if (srsName.includes('::')) {
		// Case 1 example: "urn:ogc:def:crs:EPSG::25832"
		return `EPSG:${srsName.split('::')[1]}`
	} else if (srsName.includes(':')) {
		// Case 2 example: "EPSG:25832"
		return srsName
	}
	console.error('Unknown formatting of projection:', srsName)
	throw Error('Unknown formatting of projection: ' + srsName)
}

const mapFeatures = (
	results: MpapiResult[],
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

		return toMerged(result, {
			signal,
			title: name,
			epsg: featureEpsg,
			geometry: toMerged(geometry, {
				coordinates:
					featureEpsg === queryEpsg
						? coordsAsIntegers
						: transform(coordsAsIntegers, featureEpsg, queryEpsg),
			}),
		})
	})
