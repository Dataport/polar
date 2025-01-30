import { LanguageOption } from '@polar/lib-custom-types'

// first type will be used as fallback language
const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      common: {
        canvas: {
          label: 'Kartenanwendung',
        },
        error: {
          serviceUnavailable:
            'Der Kartendienst "{{serviceName}}" (ID: {{serviceId}}) ist derzeit nicht verfügbar. Dies kann die Funktionalität der Karte einschränken.',
        },
        overlay: {
          noControlOnZoom: 'Verwenden Sie Strg+Scrollen zum Zoomen der Karte',
          noCommandOnZoom:
            'Verwenden Sie Command ⌘ + Scrollen zum Zoomen der Karte',
          oneFingerPan:
            'Verwenden Sie mindestens zwei Finger zum Verschieben der Karte',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      common: {
        canvas: {
          label: 'Map application',
        },
        error: {
          serviceUnavailable:
            'Service  "{{serviceName}}" (ID: {{serviceId}}) is unavailable. This may limit the map\'s functionality.',
        },
        overlay: {
          noControlOnZoom: 'Use Ctrl+Mousewheel to zoom into the map',
          noCommandOnZoom: 'Use Command ⌘ + Mousewheel to zoom into the map',
          oneFingerPan: 'Use at least two fingers to pan the map',
        },
      },
    },
  },
]

export default language
