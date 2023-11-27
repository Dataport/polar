import { FilterConfiguration } from '@polar/lib-custom-types'

export interface FilterState {
  /*
   * keep mapping of generative field keys to their values
   * boolean: checkbox on/off
   * string: radio id
   * number[]: freeSelection from/to
   */
  valueStore: Record<string, boolean | string | number[]>
}

export interface FilterGetters extends FilterState {
  filterConfiguration: FilterConfiguration
}
