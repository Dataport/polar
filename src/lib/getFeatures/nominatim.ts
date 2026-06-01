import type { GeoJSONFeatureCollection } from 'ol/format/GeoJSON'

import type { PolarGeoJsonFeatureCollection } from '@/core'

import type { NominatimParameters } from './types'

import { transformGeometry } from '../transformGeometry'

export default async function (
	signal: AbortSignal,
	url: string,
	inputValue: string,
	queryParameters: NominatimParameters
): Promise<PolarGeoJsonFeatureCollection> {
	const { epsg, maxFeatures, ...native } = queryParameters

	const fetchUrl = new URL(url)
	for (const [key, value] of Object.entries(native)) {
		fetchUrl.searchParams.set(
			key,
			Array.isArray(value) ? value.join(',') : String(value)
		)
	}
	if (maxFeatures) {
		fetchUrl.searchParams.set('limit', String(maxFeatures))
	}
	fetchUrl.searchParams.set('q', inputValue)
	fetchUrl.searchParams.set('format', 'geojson')
	// Setting this to 1 is currently not supported well by addressSearch plugin. The plugin expects a point geometry.
	fetchUrl.searchParams.set('polygon_geojson', '0')
	fetchUrl.searchParams.set('polygon_threshold', '5')

	return await fetch(fetchUrl, {
		signal,
	})
		.then(async (response) => <GeoJSONFeatureCollection>await response.json())
		.then((featureCollection) => ({
			...featureCollection,
			features: featureCollection.features.map((feature) => ({
				...feature,
				title: feature.properties?.display_name,
				geometry: transformGeometry(feature.geometry, 'EPSG:4326', epsg),
			})),
		}))
}
