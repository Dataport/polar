import type { Point } from 'geojson'

/**
 * Additional queryParameters for the GET-Request; for the specific parameters
 * for each request, please refer to the types of the specific methods.
 */
export interface QueryParameters {
	/** Sets the maximum number of features to retrieve. */
	maxFeatures?: number
}

/** Federal states of Germany */
export type Bundesland =
	| 'Baden-Württemberg'
	| 'Bayern'
	| 'Berlin'
	| 'Brandenburg'
	| 'Bremen'
	| 'Hamburg'
	| 'Hessen'
	| 'Mecklenburg-Vorpommern'
	| 'Niedersachsen'
	| 'Nordrhein-Westfalen'
	| 'Rheinland-Pfalz'
	| 'Saarland'
	| 'Sachsen'
	| 'Sachsen-Anhalt'
	| 'Schleswig-Holstein'
	| 'Thüringen'

/** Filter for the results as described at {@link https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/geokodierungsdienst.pdf} under 2.1.1. */
export interface BKGFilter {
	bundesland?: Bundesland
}

/**
 * Specific QueryParameters for the BKG search.
 *
 * With this search mode, queryParameter's key-value pairs are used in the service
 * query. E.g. `{filter: { bundesland: 'Bremen' }}` results in the GET request URL
 * having `&filter=bundesland:Bremen` as suffix.
 *
 * Additionally, it is possible to configure the parameters `accesstoken` (`Authorization`)
 * or `apiKey` (custom header `X-Api-Key`) to send the described headers to the
 * search service for authentication purposes.
 * Note that this changes the request to be non-simple. To be able to use the
 * parameters, the request has to be sent in [`cors` mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)
 * and has to support preflight request `OPTIONS`.
 *
 * @remarks
 * For more options, please check the [official documentation](https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/geokodierungsdienst.pdf)
 * under 4.4.3.3 regarding what query parameters are interpreted.
 */
export interface BKGParameters extends QueryParameters {
	/** Authorization header used for authentication, if given */
	accessToken: string

	/** X-Api-Key header used for authentication, if given */
	apiKey: string

	/** Currently used projection of the map */
	epsg: `EPSG:${string}`

	/** Limit search to the defined filter attributes */
	filter?: BKGFilter
}

/**
 * Specific queryParameters used for the gazetteer search implemented in
 * `@masterportal/masterportalapi`.
 *
 * While all fields are optional, configuring none of them will yield undefined
 * behaviour. At least one search instruction should be set to `true`.
 *
 * @remarks
 * Please mind that this requires a configured backend.
 * A WFS's Stored Query is requested with predefined parameters using `@masterportal/masterportalapi`.
 * This implementation is meant for e.g. https://geodienste.hamburg.de/HH_WFS_GAGES,
 * but works with other WFS configured in the same manner.
 */
export interface MpapiParameters extends QueryParameters {
	/** Currently used projection of the map. */
	epsg: `EPSG:${string}`

	/**
	 * Whether to search for a whole address.
	 * For backward compatibility, if `searchAddress` is not configured,
	 * the `searchAddress` attribute is set to `true` when {@link searchStreets}
	 * and {@link searchHouseNumbers} are set to `true`.
	 */
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

	/**  Whether to search for streets by keys. */
	searchStreetKey?: boolean

	/**
	 * Whether to search for streets.
	 * Required in order to use {@link searchHouseNumbers}.
	 */
	searchStreets?: boolean
}

export interface MpapiResult {
	geometry: Point
	name: string
	properties: MpapiResultProperties

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

interface MpapiResultProperties {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	position: { Point: [{ $: { srsName: string } }] }
	title: string
}
