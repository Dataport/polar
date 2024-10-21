import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      snowbox: {
        attributions: {
          basemap: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
          basemapGrey: 'Basemap Grau © basemap.de / BKG <MONTH> <YEAR>',
          underground:
            'Strecken U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          rapid:
            'Strecken S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          hamburgBorder: 'Landesgrenze Hamburg © Freie und Hansestadt Hamburg',
        },
        layers: {
          basemap: 'Basemap.de (Farbe)',
          basemapGrey: 'Basemap.de (Grau)',
          underground: 'U-Bahn',
          rapid: 'S-Bahn',
          hamburgBorder: 'Landesgrenze Hamburg',
        },
      },
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
          underground:
            'Railway Lines U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          rapid:
            'Railway Lines S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
          hamburgBorder: 'City border Hamburg © Freie und Hansestadt Hamburg',
        },
        layers: {
          basemap: 'Basemap.de (Coloured)',
          basemapGrey: 'Basemap.de (Grey)',
          underground: 'Underground railway (U-Bahn)',
          rapid: 'City rapid railway (S-Bahn)',
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

export default language
