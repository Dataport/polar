import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    gfi: {
      header: {
        close: 'Informationsfenster schließen',
        field: 'Feld',
        value: 'Wert',
      },
      property: {
        export: 'Export als PDF',
        imageAlt:
          'Bitte entnehmen Sie Informationen zum Inhalt des Bildes aus den umliegenden Tabellenfeldern',
        linkTitle: 'In neuem Tab öffnen',
      },
      switch: {
        previous: 'Vorangehender Datensatz',
        next: 'Nächster Datensatz',
      },
      noActiveLayer:
        'Derzeit ist kein Kartenmaterial mit passenden Objekten eingeschaltet.',
      list: {
        header: 'Objektliste',
        entry: 'Eintrag',
        to: 'bis',
        of: 'von',
        emptyView:
          'Im aktuellen Kartenausschnitt sind keine Objekte enthalten.',
        pagination: {
          currentPage: 'Aktuelle Seite, Seite {{page}}',
          page: 'Seite {{page}}',
          next: 'Nächste Seite',
          previous: 'Vorherige Seite',
          wrapper: 'Seitenauswahl',
        },
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    gfi: {
      header: {
        close: 'Close information window',
        field: 'Field',
        value: 'Value',
      },
      property: {
        export: 'Export as a PDF document',
        imageAlt:
          'Please refer to the other table fields for further information about the topics of the displayed picture',
        link: 'Open in a new tab',
      },
      switch: {
        previous: 'Previous data',
        next: 'Next data',
      },
      noActiveLayer: 'Currently, no map layer with fitting objects is active.',
      list: {
        header: 'Feature list',
        entry: 'Entry',
        to: 'to',
        of: 'of',
        emptyView: 'There are no features in the current view.',
        pagination: {
          currentPage: 'Current page, page {{page}}',
          page: 'Page {{page}}',
          next: 'Next page',
          previous: 'Previous page',
          wrapper: 'Pagination',
        },
      },
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
