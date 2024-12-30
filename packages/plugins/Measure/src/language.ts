import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        measure: {
          measureMode: {
            area: 'Fläche',
            distance: 'Entfernung',
          },
          mode: {
            none: 'Keine Interaktion',
            select: 'Auswählen',
            draw: 'Zeichnen',
            edit: 'Bearbeiten',
            delete: 'Löschen',
          },
          title: {
            measureMode: 'Messmodus',
            mode: 'Modus',
            unit: 'Einheit',
          },
          deleteAllButton: 'Alle löschen',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        measure: {
          measureMode: {
            area: 'Area',
            distance: 'Distance',
          },
          mode: {
            none: 'No interaction',
            select: 'Select',
            draw: 'Draw',
            edit: 'Edit',
            delete: 'Delete',
          },
          title: {
            measureMode: 'Measure mode',
            mode: 'Mode',
            unit: 'Unit',
          },
          deleteAllButton: 'Delete all',
        },
      },
    },
  },
]

export default language
