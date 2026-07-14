import type { ReverseGeocoderFeature } from '../types'

import { transform as transformCoordinate } from 'ol/proj'

interface NominatimReverseGeocodeResponse {
	address: {
		house_number?: string
		road?: string
		hamlet?: string
		village?: string
		town?: string
		suburb?: string
		city_district?: string
		city?: string
		county?: string
		state_district?: string
		state?: string
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'ISO3166-2-lvl4'?: string
		postcode?: string
		country?: string
		country_code?: string
	}
	boundingbox: [string, string, string, string]
	category: string
	display_name: string
	importance: number
	lat: string
	licence: string
	lon: string
	name: string
	osm_id: string
	osm_type: string
	place_id: number
	type: string
	extratags?: Record<string, unknown>
	icon?: string
	place_rank?: number
}

export async function reverseGeocodeNominatim({
	url,
	coordinate,
	epsg,
	signal,
}: {
	url: string
	coordinate: [number, number]
	epsg: string
	signal: AbortSignal
}): Promise<ReverseGeocoderFeature> {
	const searchCoordinate = transformCoordinate(
		coordinate,
		epsg,
		'EPSG:4326'
	) as [number, number]

	const fetchUrl = new URL(url)
	fetchUrl.searchParams.set('lat', searchCoordinate[1].toString())
	fetchUrl.searchParams.set('lon', searchCoordinate[0].toString())
	fetchUrl.searchParams.set('format', 'jsonv2')

	const result: NominatimReverseGeocodeResponse = await fetch(fetchUrl, {
		signal,
	}).then((response) => response.json())

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
		properties: {},
		geometry: {
			// as clicked by user - usually want to keep this since user is pointing at something
			coordinates: coordinate,
			type: 'Point',
		},
		addressGeometry: {
			// as returned by reverse geocoder
			coordinates: transformCoordinate(
				[Number(result.lon), Number(result.lat)],
				'EPSG:4326',
				epsg
			),
			type: 'Point',
		},
	}
}
