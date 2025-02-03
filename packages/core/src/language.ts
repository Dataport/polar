import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
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
}

export const resourcesEn = {
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
}

// first type will be used as fallback language
const language: Locale[] = [
  {
    type: 'de',
    resources: resourcesDe,
  },
  {
    type: 'en',
    resources: resourcesEn,
  },
]

export default language
