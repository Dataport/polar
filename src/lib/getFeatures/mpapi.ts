import { search, setGazetteerUrl } from '@masterportal/masterportalapi'
import { toMerged } from 'es-toolkit'
import { transform } from 'ol/proj'
import type { MpapiParameters, MpapiResult } from './types'
import type { PolarFeature, PolarFeatureCollection } from '@/core'

// AbortSignal is not used as the AbortController is implemented by @masterportal/masterportalapi

export default async function (
	_: AbortSignal,
	url: string,
	input: string,
	queryParameters: MpapiParameters
): Promise<PolarFeatureCollection> {
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
		if (!results[0]) {
			results = (await search(input, baseQueryParameters)) as MpapiResult[]
			if (!results[0]) {
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
	queryEpsg: string,
	featureEpsg: string
): PolarFeature[] =>
	results.map((result) => {
		const { name, geometry } = result

		return {
			type: 'Feature',
			title: name,
			geometry: toMerged(geometry, {
				coordinates:
					featureEpsg === queryEpsg
						? geometry.coordinates.map(Number)
						: transform(
								geometry.coordinates.map(Number),
								featureEpsg,
								queryEpsg
							),
			}),
			properties: result.properties,
		}
	})
