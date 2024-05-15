import {
  AddressSearchConfiguration,
  MemberSuffix,
  QueryParameters,
  SearchMethodConfiguration,
  AddressSearchGroupProperties,
  AddressSearchCategoryProperties,
} from '@polar/lib-custom-types'
import Vue from 'vue'
import { WFSVersion } from '@polar/lib-get-features'
import { Feature, FeatureCollection } from 'geojson'

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

/** Filter for the results as described at {@link https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/geokodierungsdienst.pdf} under 2.1.1 */
export interface BKGFilter {
  bundesland?: Bundesland
}

/** Specific QueryParameters for the BKG search as described at {@link https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/geokodierungsdienst.pdf} under 4.4.3.3 */
export interface BKGParameters extends QueryParameters {
  /** Authorization header used for authentication, if given */
  accessToken: string
  /** X-Api-Key header used for authentication, if given */
  apiKey: string
  /** Limit search to the defined filter attributes */
  filter?: BKGFilter
}

/**
 * Specific QueryParameters for a GetFeature request to a WFS-G.
 * Further information can be retrieved from the WFS specification
 */
export interface GazetteerParameters extends QueryParameters {
  /** The fieldName to be searched within the service */
  fieldName: string
  // TODO: It is assumed, for now, that a WFS-G always uses a Stored Query
  /** Id of the stored query of the service to request the features */
  storedQueryId: string
  memberSuffix: MemberSuffix
  /** The namespaces of the service; obsolete with WFS\@3.0.0 as GeoJSON will be the standard response */
  namespaces: string | string[]
  // TODO: Check whether a WFS-G can only be a WFS@2.0.0 or also a WFS@1.1.0
  version?: WFSVersion
}

// Specific queryParameters used for the gazetteer search implemented in the masterportalAPI
export interface MpApiParameters extends QueryParameters {
  // Whether to search for a whole address
  searchAddress?: boolean
  // Whether to search for districts
  searchDistricts?: boolean
  // Whether to search for house numbers; can only be used if also 'searchStreets' is in use with 'true'
  searchHouseNumbers?: boolean
  // Whether to search for parcels
  searchParcels?: boolean
  // Whether to search for street keys
  searchStreetKey?: boolean
  // Whether to search for streets
  searchStreets?: boolean
}

export interface FeatureIndexZip {
  value: FeatureCollection
  index: number
}

export interface AddressSearchState {
  /** Selected address by the user */
  chosenAddress: object | null
  /** Currently entered value */
  inputValue: string
  /** Whether to currently display a loading animation on the input */
  loading: boolean
  /**
   * Found features with groupIndex in selected group or a symbol indicating that
   * a) an error occurred
   * b) nothing has been search yet
   */
  searchResults: FeatureIndexZip[] | symbol
  /** SearchMethod group name; null will fall back to first-found */
  selectedGroupId: string | null
}

export interface FeatureListWithCategory {
  features: Feature[]
  categoryId: string
  category: string
}

export interface AddressSearchGetters extends AddressSearchState {
  addressSearchConfiguration: AddressSearchConfiguration
  featuresAvailable: boolean
  minLength: number
  waitMs: number
  searchMethods: SearchMethodConfiguration[]
  searchMethodsByGroupId: Record<string, SearchMethodConfiguration[]>
  groupIds: string[]
  selectedGroupId: string
  selectedGroup: SearchMethodConfiguration[]
  getGroupProperties: (string) => AddressSearchGroupProperties
  selectedGroupProperties: AddressSearchGroupProperties
  limitResults: number
  categoryProperties: AddressSearchCategoryProperties
  label: string
  placeholder: string
  selectedGroupHint: string
  hint: string
  hasMultipleGroups: boolean
  groupSelectOptions: string[]
  featureListsWithCategory: FeatureListWithCategory[]
  focusAfterSearch: boolean
  afterResultComponent: Vue | null
}

export type AddressSearchAutoselect = 'first' | 'only' | 'never'
