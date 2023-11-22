import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
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
          list: {
            header: 'Objektliste',
          },
          noActiveLayer:
            'Derzeit ist kein Kartenmaterial mit passenden Objekten eingeschaltet.',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
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
          noActiveLayer:
            'Currently, no map layer with fitting objects is active.',
        },
      },
    },
  },
]

export default language
