import { transform as transformCoordinates } from 'ol/proj'
import type { BKGParameters } from './types'
import type { PolarGeoJsonFeatureCollection } from '@/core'

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

export default function (
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
				title: feature.properties.text,
			})),
		}))
}
