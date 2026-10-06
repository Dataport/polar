import type { FeatureCollection, Point } from 'geojson'
import type { Polygon } from 'geojson'
import type { ReverseGeocoderFeature } from '../types'

interface BkgReverseGeocodeProperties {
	ags: string
	bbox: Polygon
	bundesland: string
	gemeinde: string
	haus: string
	kreis: string
	ort: string
	ortsteil: string
	plz: string
	qualitaet: 'A' | 'B' | 'C' | 'P'
	regbezirk: string
	rs: string
	schluessel: string
	score: number
	strasse: string
	text: string
	typ: string
	verwgem: string
}

export async function reverseGeocodeBkg({
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
	const fetchUrl = new URL(url)
	fetchUrl.searchParams.set('lat', coordinate[1].toString())
	fetchUrl.searchParams.set('lon', coordinate[0].toString())
	fetchUrl.searchParams.set('srsName', epsg)
	fetchUrl.searchParams.set('distance', '500')
	fetchUrl.searchParams.set('count', '1')

	const result: FeatureCollection<Point, BkgReverseGeocodeProperties> =
		await fetch(fetchUrl, { signal }).then((response) => response.json())

	const feature = result.features[0]
	if (!feature) {
		throw new Error('No features returned from BKG reverse geocode')
	}
	const { properties } = feature

	return {
		type: 'reverse_geocoded',
		title: [
			[properties.strasse, properties.haus].join(' '),
			[properties.plz, properties.ort, `(${properties.ortsteil})`].join(' '),
		].join(', '),
		properties,
		geometry: {
			// as clicked by user - usually want to keep this since user is pointing at something
			coordinates: coordinate,
			type: 'Point',
		},
		addressGeometry: {
			// as returned by reverse geocoder
			coordinates: feature.geometry.coordinates,
			type: 'Point',
		},
	}
}
