import { Attribution } from '@polar/lib-custom-types'

export interface AttributionsState {
  attributions: Attribution[]
  layer: string[]
  // Parameter is only relevant if the attributions plugin controls the toggling of the window
  windowIsOpen: boolean
}

export interface AttributionsGetters extends AttributionsState {
  initiallyOpen: boolean
  /** Array on store paths to listen to for changes */
  listenToChanges: string[]
  mapInfo: string[]
  mapInfoIcon: string
  renderType: 'independent' | 'iconMenu' | 'footer'
  staticAttributions: string[]
  windowWidth: number
}
