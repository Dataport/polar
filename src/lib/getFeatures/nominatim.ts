import type { Point } from 'geojson'
import type { PolarGeoJsonFeatureCollection } from '@/core'
import type { NominatimParameters } from './types'

import { transform as transformCoordinates } from 'ol/proj'

export default async function (
	signal: AbortSignal,
	url: string,
	inputValue: string,
	queryParameters: NominatimParameters
): Promise<PolarGeoJsonFeatureCollection> {
	const { epsg, maxFeatures, ...native } = queryParameters

	const fetchUrl = new URL(url)
	Object.entries({
		...Object.fromEntries(
			Object.entries(native).map(([key, value]) => [
				key,
				Array.isArray(value) ? value.join(',') : value,
			])
		),
		...(maxFeatures ? { limit: maxFeatures } : {}),
		q: inputValue,
		format: 'geojson',
		polygon_geojson: 0, // TODO: Setting this to 1 is currently not supported well by addressSearch plugin. The plugin expects a point geometry.
		polygon_threshold: 5,
	}).forEach(([key, value]) => {
		fetchUrl.searchParams.set(key, value.toString())
	})

	return await fetch(fetchUrl, {
		signal,
	})
		.then((response) => response.json())
		.then((featureCollection) => ({
			...featureCollection,
			features: featureCollection.features.map((feature) => ({
				...feature,
				title: feature.properties.display_name,
				geometry: {
					...feature.geometry,
					coordinates:
						epsg === 'EPSG:4326'
							? feature.geometry.coordinates
							: feature.geometry.type === 'Polygon'
								? feature.geometry.coordinates.map((ring) =>
										ring.map((coord) =>
											transformCoordinates(coord, 'EPSG:4326', epsg)
										)
									)
								: transformCoordinates(
										(feature.geometry as Point).coordinates,
										'EPSG:4326',
										epsg
									),
				},
			})),
		}))
}
