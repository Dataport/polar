import { Locale } from '@polar/lib-custom-types'

export const snowboxDe = {
  attributions: {
    basemap: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
    basemapGrey: 'Basemap Grau © basemap.de / BKG <MONTH> <YEAR>',
    flurstuecke:
      'Flurstücke © Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung (LGV)',
    underground:
      'Strecken U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
    rapid:
      'Strecken S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
    reports: 'Meldungen durch Bürger',
    ausgleichsflaechen:
      'Ausgleichsflächen © Freie und Hansestadt Hamburg, Behörde für Umwelt und Energie',
    hamburgBorder: 'Landesgrenze Hamburg © Freie und Hansestadt Hamburg',
  },
  layers: {
    basemap: 'Basemap.de (Farbe)',
    basemapGrey: 'Basemap.de (Grau)',
    flurstuecke: 'Flurstücke',
    underground: 'U-Bahn',
    rapid: 'S-Bahn',
    reports: 'Anliegen (MML)',
    ausgleichsflaechen: 'Ausgleichsflächen',
    hamburgBorder: 'Landesgrenze Hamburg',
  },
} as const

const locales: Locale[] = [
  {
    type: 'de',
    resources: {
      snowbox: snowboxDe,
      plugins: {
        pins: {
          toast: {
            notInBoundary:
              'Der Testklient ist auf Hamburg eingeschränkt. Bitte wählen Sie eine Position in Hamburg.',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      snowbox: {
        attributions: {
          basemap: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
          basemapGrey: 'Basemap Grey © basemap.de / BKG <MONTH> <YEAR>',
          flurstuecke:
            'Parcels © Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung (LGV)',
          underground:
            'Railway Lines U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          rapid:
            'Railway Lines S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          reports: 'Reports by citizens',
          ausgleichsflaechen:
            'Compensation area © Freie und Hansestadt Hamburg, Behörde für Umwelt und Energie',
          hamburgBorder: 'City border Hamburg © Freie und Hansestadt Hamburg',
        },
        layers: {
          basemap: 'Basemap.de (Coloured)',
          basemapGrey: 'Basemap.de (Grey)',
          flurstuecke: 'Parcels',
          underground: 'Underground railway (U-Bahn)',
          rapid: 'City rapid railway (S-Bahn)',
          reports: 'Reports (MML)',
          ausgleichsflaechen: 'Compensation area',
          hamburgBorder: 'City border Hamburg',
        },
      },
      plugins: {
        pins: {
          toast: {
            notInBoundary:
              'The test client is restricted to Hamburg. Please choose a position in Hamburg.',
          },
        },
      },
    },
  },
]

export default locales
