import type { Point } from 'geojson'

/**
 * Additional queryParameters for the GET-Request; for the specific parameters
 * for each request, please refer to the types of the specific methods.
 */
export interface QueryParameters {
	/** Sets the maximum number of features to retrieve. */
	maxFeatures?: number
}

/**
 * Specific queryParameters used for the gazetteer search implemented in
 * `@masterportal/masterportalapi`.
 */
export interface MpapiParameters extends QueryParameters {
	/** Currently used projection of the map. */
	epsg: `EPSG:${string}`

	/** Whether to search for a whole address. */
	searchAddress?: boolean

	/** Whether to search for districts. */
	searchDistricts?: boolean

	/**
	 * Whether to search for house numbers; can only be used if also
	 * {@link searchStreets} is in use and set to `true`.
	 */
	searchHouseNumbers?: boolean

	/** Whether to search for parcels. */
	searchParcels?: boolean

	/**  Whether to search for street keys. */
	searchStreetKey?: boolean

	/** Whether to search for streets. */
	searchStreets?: boolean
}

export interface MpapiResult {
	geometry: Point
	name: string
	properties: object

	/**
	 * Based on the values of searchTypes from
	 * \@masterportal/masterportalapi/src/searchAddress/types.
	 */
	type:
		| 'street'
		| 'district'
		| 'parcel'
		| 'streetKey'
		| 'addressAffixed'
		| 'addressUnaffixed'
		| 'houseNumbersForStreet'
}
