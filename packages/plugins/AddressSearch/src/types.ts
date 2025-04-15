import {
  AddressSearchCategoryProperties,
  AddressSearchConfiguration,
  AddressSearchGroupProperties,
  QueryParameters,
  SearchMethodConfiguration,
} from '@polar/lib-custom-types'
import { Feature, FeatureCollection } from 'geojson'
import { VueConstructor } from 'vue'

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
  /** Currently used projection of the map */
  epsg: `EPSG:${string}`
  /** Limit search to the defined filter attributes */
  filter?: BKGFilter
}

// Specific queryParameters used for the gazetteer search implemented in the masterportalAPI
export interface MpApiParameters extends QueryParameters {
  /** Currently used projection of the map */
  epsg: `EPSG:${string}`
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
  afterResultComponent: VueConstructor | null
  component: VueConstructor | null
}

export type AddressSearchAutoselect = 'first' | 'only' | 'never'
