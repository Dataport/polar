import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        layerChooser: {
          backgroundTitle: 'Hintergrundkarte',
          maskTitle: 'Fachdaten',
          tooltipDisabledLayer: 'Auf der aktuellen Zoomstufe nicht verfügbar.',
          optionsHeader: 'Optionen für Layer "{{name}}"',
          layerHeader: 'Auswahl sichtbarer Ebenen',
          layerOptions: 'Optionen für Kartenmaterial',
          returnToLayers: 'Zurück zur Auswahl',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
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
    },
  },
]

export default language
