import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    layerChooser: {
      backgroundTitle: 'Hintergrundkarten',
      maskTitle: 'Fachdaten',
      tooltipDisabledLayer: 'Auf der aktuellen Zoomstufe nicht verfügbar.',
      optionsHeader: 'Optionen für Layer "{{name}}"',
      layerHeader: 'Auswahl sichtbarer Ebenen',
      layerOptions: 'Optionen für Kartenmaterial',
      returnToLayers: 'Zurück zur Auswahl',
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    layerChooser: {
      backgroundTitle: 'Background maps',
      maskTitle: 'Subject data',
      tooltipDisabledLayer: 'Not available on the current zoom level.',
      optionsHeader: '"{{name}}" layer options',
      layerHeader: 'Visible layer selection',
      layerOptions: 'Map data options',
      returnToLayers: 'Return to selection',
    },
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default locales
