import { QueryParameters } from '@polar/lib-custom-types'
import { Feature as GeoJsonFeature } from 'geojson'

/** Optional options related to a GetFeature request */
export interface AdditionalSearchOptions {
  /** Which fieldName(s) to use for display purposes; e.g. used in the AddressSearch for the result list */
  title?: string | string[]
  /** The maximum amount of features to be returned by the service */
  maxFeatures?: number
  /** ID of the stored query of the service to request the features */
  storedQueryId?: string
  /** defines typeNames to consider for search, if service accepts reduction */
  typeNames?: string | string[]
}

/*
 * Explanation by dimension:
 *   First: each child resembles a query
 *   Second: children will be ANDed on multiple children
 *   Third: [key, value] where key is a property name
 * Explanation by example:
 *   [[['a', 'b'], ['a', 'c']], [['a', 'b']]]
 *     becomes
 *   QUERY(a=b && c=d), QUERY(a=b)
 *     where the second query is only executed if the first doesn't fill
 *     maxFeatures to its limit.
 */
export type KeyValueSetArray = Array<Array<[string, string]>>

/** Adds the possibility to have a 'title' attribute in a GeoJSON Feature */
export interface PolarGeoJsonFeature extends GeoJsonFeature {
  /** The projection of the coordinates of the features */
  epsg: `EPSG:${string}`
  /** Which fieldName to use for display purposes; e.g. used in the AddressSearch for the result list */
  title?: string
}

/** Which values to search for in the GetFeature request */
export interface SearchParameters {
  /** Mapping of fieldName and to be searched value */
  [fieldName: string]: string
}

/** Parameters for wfs searches */
export interface WfsParameters extends QueryParameters {
  /** Feature prefix from xmlns namespace without :; e.g. 'ave' */
  featurePrefix: string
  /** Name of the type of features (see ?service=wfs&request=DescribeFeatureType) */
  typeName: string
  /** Namespace of feature type */
  xmlns: string
  /** Name of the type's field to search in; mutually exclusive to patterns */
  fieldName?: string
  /** Input destructor patterns, e.g. \{\{streetName\}\} \{\{houseNumber\}\}; mutually exclusive to fieldName */
  patterns?: string[]
  /** RegExp to define pattern, e.g. \{houseNumber: '([1-9][0-9]*[a-z]?)', ...\}; only if patterns present */
  patternKeys?: Record<string, string>
  /** srsName for wfs query */
  srsName?: string
  /** By default, if searching for "search", it is sent as "search*"; can be deactivated */
  useRightHandWildcard?: boolean
  /** custom attributes for the like operators in filters */
  likeFilterAttributes?: Record<string, string>
}

/**
 * Eligible WFS versions.
 * NOTE: If more are usable / needed, add 'em here.
 */
export type WFSVersion = '1.1.0' | '2.0.0'
