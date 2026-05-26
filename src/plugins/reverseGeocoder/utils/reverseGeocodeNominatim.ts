import { transform as transformCoordinate } from 'ol/proj'

import type { ReverseGeocoderFeature } from '../types'

export async function reverseGeocodeNominatim(
	url: string,
	coordinate: [number, number],
	epsg: string,
	signal: AbortSignal
): Promise<ReverseGeocoderFeature> {
	const searchCoordinate = transformCoordinate(
		coordinate,
		epsg,
		'EPSG:4326'
	) as [number, number]

	const fetchUrl = new URL(url)
	fetchUrl.searchParams.set('lat', searchCoordinate[1].toString())
	fetchUrl.searchParams.set('lon', searchCoordinate[0].toString())
	fetchUrl.searchParams.set('format', 'jsonv2')

	const result = await fetch(fetchUrl, { signal }).then((response) =>
		response.json()
	)

	return {
		type: 'reverse_geocoded',
		title: [
			[result.address.road, result.address.house_number]
				.filter((x) => x)
				.join(' '),
			result.address.town || result.address.city || result.address.village,
		]
			.filter((x) => x)
			.join(', '),
		properties: result.properties,
		geometry: {
			// as clicked by user - usually want to keep this since user is pointing at something
			coordinates: coordinate,
			type: 'Point',
		},
		addressGeometry: {
			// as returned by reverse geocoder
			coordinates: transformCoordinate(
				[result.lon, result.lat],
				'EPSG:4326',
				epsg
			),
			type: 'Point',
		},
	}
}
