import { Attribution } from '@polar/lib-custom-types'
import Vue from 'vue'

export interface AttributionInstance extends Vue {
  isOpen: boolean
  toggleMapInfo: () => void
}

export interface AttributionsState {
  layer: string[]
  attributions: Attribution[]
  // Parameter is only relevant if the attributions plugin controls the toggling of the window
  windowIsOpen: boolean
}

export interface AttributionsGetters extends AttributionsState {
  /** Array on store paths to listen to for changes */
  listenToChanges: string[]
  mapInfo: string[]
  initiallyOpen: boolean
  renderType: 'independent' | 'iconMenu' | 'footer'
  staticAttributions: string[]
  windowWidth: number
}
