import { Resource } from 'i18next'

const de: Resource = {
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

export default de
