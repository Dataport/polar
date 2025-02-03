import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    filter: {
      category: {
        deselectAll: 'Alle an-/abwählen',
      },
      time: {
        header: 'Zeitraum',
        noRestriction: 'Keine Einschränkung',
        last: {
          days_one: 'Der letzte Tag',
          days_other: 'Die letzten {{ count }} Tage',
        },
        next: {
          days_one: 'Der nächste Tag',
          days_other: 'Die nächsten {{ count }} Tage',
        },
        chooseTimeFrame: {
          label: 'Zeitraum wählen',
          info: 'Bitte wählen Sie ein Einzeldatum oder das erste und letzte Datum eines Zeitraums.',
        },
        vuetify: {
          aria: {
            nextMonth: 'Nächsten Monat auswählen',
            nextYear: 'Nächstes Jahr auswählen',
            prevMonth: 'Vorherigen Monat auswählen',
            prevYear: 'Vorheriges Jahr auswählen',
          },
        },
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    filter: {
      category: {
        deselectAll: 'De-/select all',
      },
      time: {
        header: 'Time frame',
        noRestriction: 'No restriction',
        last: {
          days_one: 'The last day',
          days_other: 'The last {{ count }} days',
        },
        next: {
          days_one: 'The next day',
          days_other: 'The next {{ count }} days',
        },
        chooseTimeFrame: {
          label: 'Choose time frame',
          info: 'Please choose a singular date or the first and last date of a time frame.',
        },
        vuetify: {
          aria: {
            nextMonth: 'Choose next month',
            nextYear: 'Choose next year',
            prevMonth: 'Choose previous month',
            prevYear: 'Choose previous year',
          },
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
