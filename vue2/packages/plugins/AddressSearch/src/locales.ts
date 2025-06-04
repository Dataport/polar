import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    addressSearch: {
      hint: {
        error: 'Etwas ist bei der Suche schiefgegangen.',
        noResults: 'Keine Ergebnisse gefunden.',
        loading: 'Suche ...',
        tooShort:
          'Für die Suche bitte mindestens {{minLength}} Zeichen eingeben.',
      },
      defaultGroup: 'Adresssuche',
      groupSelector: 'Suchthema auswählen',
      resultCount: '({{count}} Ergebnisse)',
      resultList: {
        extend: 'Alle Ergebnisse anzeigen',
        extendMax:
          'Alle Ergebnisse (max. {{queryParameters.maxFeatures}}) anzeigen',
        reduce: 'Ergebnisliste reduzieren',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    addressSearch: {
      hint: {
        error: 'Something went wrong.',
        noResults: 'No results for the current query.',
        loading: 'Searching ...',
        tooShort: 'Please enter at least {{minLength}} characters.',
      },
      defaultGroup: 'Address Search',
      groupSelector: 'Select search topic',
      resultCount: '({{count}} results)',
      resultList: {
        extend: 'Show all results',
        extendMax: 'Show all results (max. {{queryParameters.maxFeatures}})',
        reduce: 'Reduce result list',
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
