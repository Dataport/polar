// naming convention doesn't hold since backend names are used in Beschreibung
/* eslint-disable @typescript-eslint/naming-convention */

import { FeatureCollection, GeometryObject } from 'geojson'
import { QueryParameters } from '@polar/lib-custom-types'

/* Search backend documentation:
 * https://efi2.schleswig-holstein.de/dish/dish_service/help.html
 */

/** as specified by efi search backend */
export interface EfiSearchFeature {
  Date: string | null
  anriss: string
  beschreibung: string // not yet parsed
  index: number
  link: string
  linkText: string
  rating: string
  titel: '' // always empty string ✨
}

/** as specified by efi information backend */
export interface EfiBeschreibung {
  Wert: string
  ObjektID: string
  objektansprache: string
  Kreis: string
  Gemeinde: string
  wohnplatz: string
  strasse: string
  objektart: string
  objektfunktion: string
  objektplz: string
  tbldlisteinaKurzBeschreibungen: string
  tbldlisteinaBeschreibungen: string
}

/** after beschreibung is parsed ... */
export interface ParsedEfiSearchFeature
  extends Omit<EfiSearchFeature, 'beschreibung'> {
  beschreibung: EfiBeschreibung
  geometry?: GeometryObject
}

/** used for wfs sub-configuration of dish search */
export interface WfsConfiguration {
  id: string
  srsName: string
  typeName: string
  fieldName: string
  featurePrefix: string
  xmlns: string
}

export interface DishParameters extends QueryParameters {
  searchKey: string
  wfsConfiguration: WfsConfiguration
  // topic: EfiTopic
  addRightHandWildcard: boolean
  volltexttyp?: 'CONTAINS' | 'FREETEXT'
}

export type DishSearchMethodFunction = (
  signal: AbortSignal,
  url: string,
  inputValue: string,
  queryParameters: DishParameters
) => Promise<FeatureCollection> | never

export type DishAutocompleteFunction = (
  signal: AbortSignal,
  url: string,
  inputValue: string
) => Promise<FeatureCollection>

export interface DishFeaturePropertiesOnSuccess {
  Bezeichnung: string // ehem. "Name"
  Foto: string
  Kreis: string
  Gemeinde: string
  PLZ: string
  Straße: string
  Objektnummer: string
  Detailinformationen: string
  Export: string
}

export interface DishFeaturePropertiesOnError {
  Information: string
}

export type DishFeatureProperties =
  | DishFeaturePropertiesOnSuccess
  | DishFeaturePropertiesOnError

export interface ModalState {
  confirmed: boolean
  closed: boolean
  content: number
}
