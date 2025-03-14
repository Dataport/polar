import { Locale } from '@polar/lib-custom-types'

export const diplanDe = {
  diplan: {
    error: {
      metaInformationRetrieval:
        'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
    },
    geoEditing: {
      tools: {
        drawPolygon: 'Neue Fläche einzeichnen',
        drawCircle: 'Kreis einzeichnen',
        merge: 'Flächen kombinieren',
        cut: 'Durchschneiden',
        lasso: 'Lasso',
        edit: 'Bearbeiten',
        translate: 'Fläche bewegen',
        delete: 'Fläche entfernen',
      },
    },
  },
  plugins: {
    iconMenu: {
      hints: {
        diplanLayerChooser: 'Kartenauswahl',
        geoEditing: 'Digitalisierungswerkzeuge',
      },
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
