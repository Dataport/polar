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

/** Adds the possibility to have a 'title' attribute in a GeoJSON Feature */
export interface PolarGeoJsonFeature extends GeoJsonFeature {
  /** The projection of the coordinates of the features */
  epsg: string
  /** Which fieldName to use for display purposes; e.g. used in the AddressSearch for the result list */
  title?: string
}

/** Which values to search for in the GetFeature request */
export interface SearchParameters {
  /** Mapping of fieldName and to be searched value */
  [fieldName: string]: string
}

/** Parameters for wfs searches */
export interface WfsParameters {
  /** Name of the type of features (see ?service=wfs&request=DescribeFeatureType) */
  typeName: string
  /** Name of the type's field to search in; mutually exclusive to patterns */
  fieldName?: string
  /** Input destructor patterns, e.g. \{\{streetName\}\} \{\{houseNumber\}\}; mutually exclusive to fieldName */
  patterns?: string[]
  /** RegExp to define pattern, e.g. \{houseNumber: '([1-9][0-9]*[a-z]?)', ...\}; only if patterns present */
  patternKeys?: Record<string, string>
  /** Feature prefix from xmlns namespace without :; e.g. 'ave' */
  featurePrefix: string
  /** Namespace of feature type */
  xmlns: string
  /** Limits requested features */
  maxFeatures?: number
  /** By default, if searching for "search", it is sent as "search*"; can be deactivated */
  useRightHandWildcard?: boolean
  /** srsName for wfs query */
  srsName?: string
}

/**
 * Eligible WFS versions.
 * NOTE: If more are usable / needed, add 'em here.
 */
export type WFSVersion = '1.1.0' | '2.0.0'
