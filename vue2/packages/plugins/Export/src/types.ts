import Vue from 'vue'
import { ExportConfiguration } from '@polar/lib-custom-types'

export enum ExportFormat {
  JPG = 'Jpg',
  PNG = 'Png',
  PDF = 'Pdf',
}

export enum ExportDirection {
  UP = 'up',
  DOWN = 'down',
  RIGHT = 'right',
  LEFT = 'left',
}

export interface ExportState {
  /** Base64 encoded picture of the map */
  exportedMap: string
  openInDirection: ExportDirection
}

export interface ExportGetters extends ExportState {
  configuration: ExportConfiguration
  download: boolean
  showJpg: boolean
  showPdf: boolean
  showPng: boolean
}

export type ExportAs = (ExportFormat) => void

export interface ExportComponent extends Vue, ExportState {
  /** Exports the currently visible map as the format given to the function */
  exportAs: ExportAs
}
