const locales = [
  {
    type: 'de',
    resources: {
      dish: {
        backendSizeError:
          'Die Suche ist zu allgemein. Bitte wählen Sie weitere Suchbegriffe oder schränken Sie die Suche über einen Filter ein.',
        unknownError: 'Ein unbekannter Fehler ist aufgetreten.',
        idNotFound:
          'Die verlinkte ID konnte leider nicht aufgelöst werden. Bitte verwenden Sie Suche und Karte, um zum Denkmal zu navigieren.',
        addressSearchHint: 'Eingabe von z.B. Bezeichnung, Lage, Adresse, ...',
      },
      plugins: {
        gfi: {
          property: {
            export: 'Export Detailinformationen',
          },
          toggle: 'Informationen zu Sachgesamtheit öffnen/schließen',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      dish: {
        backendSizeError:
          'Too broad search. Please choose additional search terms or use a filter.',
        unknownError: 'An unknown error occurred.',
        idNotFound:
          'The linked ID could not be found. Please use the search function or map to navigate to your point of interest.',
        addressSearchHint:
          'Entry of e.g. monument names, location, address, ...',
      },
      plugins: {
        gfi: {
          property: {
            export: 'Detail information export',
          },
          toggle: 'Open/close additional information',
        },
      },
    },
  },
]

export default locales
