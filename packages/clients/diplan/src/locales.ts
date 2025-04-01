import { Locale } from '@polar/lib-custom-types'

export const diplanDe = {
  diplan: {
    error: {
      metaInformationRetrieval:
        'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
      cutFailed:
        'Das Polygon konnte aufgrund eines unbekannten Fehlers leider nicht geschnitten werden.',
    },
    warn: {
      unevenCut:
        'Leider konnte kein Schnitt hergestellt werden, da entweder der Start- oder Endpunkt der Schnittkante innerhalb des zu schneidenden Polygons lag, oder kein Polygon geschnitten wurde. Bitte versuchen Sie es erneut.',
    },
    geoEditing: {
      tools: {
        drawPolygon: 'Neue Fläche einzeichnen',
        drawCircle: 'Kreis einzeichnen',
        merge: 'Flächen kombinieren',
        cut: 'Durchschneiden',
        duplicate: 'Duplizieren',
        lasso: 'Lasso',
        edit: 'Bearbeiten',
        translate: 'Fläche bewegen',
        delete: 'Fläche entfernen',
      },
    },
    linkButton: {
      label: 'Vollbildmodus verlassen',
      labelSmall: 'In den Vollbildmodus wechseln',
    },
  },
  plugins: {
    iconMenu: {
      hints: {
        diplanLayerChooser: 'Kartenauswahl',
        geoEditing: 'Digitalisierungswerkzeuge',
      },
    },
    layerChooser: {
      xplanTitle: 'XPlanGML',
    },
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: diplanDe,
  },
]

export default locales
