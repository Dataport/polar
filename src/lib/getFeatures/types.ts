import type { Point } from 'geojson'

/**
 * Additional queryParameters for the GET-Request; for the specific parameters
 * for each request, please refer to the types of the specific methods.
 */
export interface QueryParameters {
	/**
	 * Currently used projection of the map.
	 *
	 * @internal
	 */
	epsg: `EPSG:${string}`

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

/**
 * Explanation by dimension:
 * - First: each child resembles a query
 * - Second: children will be ANDed on multiple children
 * - Third: [key, value] where key is a property name
 *
 * Explanation by example:
 * - [[['a', 'b'], ['a', 'c']], [['a', 'b']]]
 *     becomes
 * - QUERY(a=b && c=d), QUERY(a=b),
 *     where the second query is only executed if the first doesn't fill
 *     maxFeatures to its limit.
 */
export type KeyValueSetArray = Array<Array<[string, string]>>

/**
 * Parameters for WFS searches.
 *
 * Since inputs may overlap with multiple patterns, multiple queries are fired and executed on the WFS until the
 * `maxFeatures` requirement is met, beginning with the pattern that 'looks like the user input the most'.
 * The best-fitting pattern on the returned features will be used to generate a display string.
 * When two patterns fit best, the first one is used.
 *
 * @example
 * \{
 *   srsName: 'EPSG:25832',
 *   typeName: 'address_shp',
 *   fieldName: 'objektid',
 *   featurePrefix: 'app',
 *   xmlns: 'http://www.deegree.org/app',
 *   useRightHandWildcard: true,
 * \}
 *
 * @example
 * \{
 *   srsName: 'EPSG:25832',
 *   typeName: 'address_shp',
 *   featurePrefix: 'app',
 *   xmlns: 'http://www.deegree.org/app',
 *   patternKeys: \{
 *     streetName: '([A-Za-z]+)'
 *     houseNumber: '([0-9]+)'
 *     postalCode: '([0-9]+)'
 *     city: '([A-Za-z]+)'
 *   \},
 *   patterns: [
 *     '\{\{streetName\}\} \{\{houseNumber\}\} \{\{postalCode\}\} \{\{city\}\}'
 *   ]
 * \}
 */
export interface WfsParameters extends QueryParameters {
	/** XML feature prefix from xmlns namespace without :; e.g. 'ave'. */
	featurePrefix: string

	/** Feature type to search for by name (see ?service=wfs&request=DescribeFeatureType). */
	typeName: string

	/** XML namespace of feature type to use in search. */
	xmlns: string

	/**
	 * Name of the type's field to search in.
	 *
	 * @remarks
	 * Mutually exclusive to {@link patterns}.
	 */
	fieldName?: string

	/**
	 * Custom attributes for the like operators in filters.
	 * As specified by the [OGC-Standard for filters](https://schemas.opengis.net/filter/) the `PropertyIsLike` operator
	 * requires three attributes (e.g. in WFS 2.0.0: `wildCard`, `singleChar` and `escapeChar`).
	 * These may vary in value and (with other WFS versions) also in property definition.
	 * Therefore, it is possible to configure the values of the attributes needed for WFS 2.0.0 and also to add custom
	 * attributes needed for other versions.
	 *
	 * @defaultValue `{ wildCard: "*", singleChar: ".", escapeChar: "!" }`
	 *
	 * @example
	 * WFS 2.0.0 - `{wildCard: "%", singleChar: "*", escapeChar: "\"}`
	 * WFS 1.0.0 - `{wildCard: "*", singleChar: "*", escape: "\"}`
	 */
	likeFilterAttributes?: Record<string, string>

	/**
	 * Maps field names from patterns to regexes.
	 * Each field name has to have a definition. Each regex must have one capture group that is used to search.
	 * Contents next to it are ignored for the search and just used for matching.
	 * E.g. `'([0-9]+)$'` would be a value for a key that fits an arbitrary number string at the input's end.
	 *
	 * @remarks
	 * Only usable if {@link patterns} is present.
	 *
	 * @example
	 * `{ houseNumber: '([1-9][0-9]*[a-z]?)', ... }`
	 */
	patternKeys?: Record<string, string>

	/**
	 * Allows specifying input patterns.
	 * In a single-field search, a pattern can be as easy as `{{theWholeThing}}`, where `theWholeThing` is also the
	 * feature field name to search in.
	 * In more complex scenarios, you may add separators and multiple fields, e.g. `{{gemarkung}} {{flur}} {{flstnrzae}}/{{flstnrnen}}`
	 * would fit many parcel search services.
	 *
	 * @remarks
	 * Mutually exclusive to {@link fieldName}.
	 *
	 * @example
	 * `{{streetName}} {{houseNumber}}`
	 */
	patterns?: string[]

	/** Name of the projection (srs) for the query. */
	srsName?: string

	/**
	 * By default, if searching for "search", it is sent as "search*".
	 * This behaviour can be deactivated by setting this parameter to `false`.
	 */
	useRightHandWildcard?: boolean
}
