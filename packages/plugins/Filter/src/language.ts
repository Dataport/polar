import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
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
            chooseTimeFrame: 'Zeitraum wählen',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
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
            chooseTimeFrame: 'Choose time frame',
          },
        },
      },
    },
  },
]

export default language
