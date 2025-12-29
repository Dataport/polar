import { toMerged } from 'es-toolkit'
import type { FeatureCollection, Point } from 'geojson'
import { transform as transformCoordinates } from 'ol/proj'
import type { BKGParameters } from './types'
import { errorCheck } from './errorCheck'
import type { PolarGeoJsonFeature, PolarGeoJsonFeatureCollection } from '@/core'

function getRequestUrlQuery(
	inputValue: string,
	queryParameters: BKGParameters
) {
	let query = `query=${inputValue.replace(' ', '+')}`
	for (const [key, value] of Object.entries(queryParameters).filter(
		([key]) =>
			key !== 'filter' &&
			key !== 'epsg' &&
			key !== 'apiKey' &&
			key !== 'accessToken'
	)) {
		query += `&${key}=${value}`
	}
	if (
		queryParameters.filter &&
		Object.keys(queryParameters.filter).length > 0
	) {
		query += '&filter='
		query = Object.entries(queryParameters.filter)
			.reduce((prev, [key, value]) => `${prev + key}:${value}&`, query)
			.slice(0, -1)
	}
	return query
}

export default async function (
	signal: AbortSignal,
	url: string,
	inputValue: string,
	queryParameters: BKGParameters
): Promise<PolarGeoJsonFeatureCollection> {
	const requestUrl = `${url}?` + getRequestUrlQuery(inputValue, queryParameters)
	const options: RequestInit = { signal }
	if (queryParameters.accessToken) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		options.headers = { Authorization: `Bearer ${queryParameters.accessToken}` }
	} else if (queryParameters.apiKey) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		options.headers = { 'X-Api-Key': queryParameters.apiKey }
	}
	const response = await fetch(encodeURI(requestUrl), options)
	errorCheck(response)
	const featureCollection: FeatureCollection = await response.json()
	return {
		...featureCollection,
		features: featureCollection.features.map(
			(feature) =>
				toMerged(feature, {
					geometry: toMerged(feature.geometry, {
						coordinates:
							queryParameters.epsg === 'EPSG:4326'
								? (feature.geometry as Point).coordinates
								: transformCoordinates(
										(feature.geometry as Point).coordinates,
										'EPSG:4326',
										queryParameters.epsg
									),
					}),
					// @ts-expect-error | It is always defined in this case
					title: feature.properties.text,
				}) as PolarGeoJsonFeature<Point>
		),
	}
}
