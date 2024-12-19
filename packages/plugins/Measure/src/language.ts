import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  // TODO: Reduce these to the ones needed once the rest is worked on
  {
    type: 'de',
    resources: {
      plugins: {
        measure: {
          mode: {
            select: 'Auswählen',
            draw: 'Zeichnen',
            edit: 'Bearbeiten',
            delete: 'Löschen',
          },
          title: {
            mode: 'Modus',
            unit: 'Einheit',
          },
          label: {
            line: 'Linie',
            text: 'Text',
            distance: 'Entfernung',
            area: 'Fläche',
            deleteAll: 'Alle löschen',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        measure: {
          mode: {
            select: 'Select',
            draw: 'Draw',
            edit: 'Edit',
            delete: 'Delete',
          },
          title: {
            mode: 'Mode',
            unit: 'Unit',
          },
          label: {
            line: 'Line',
            text: 'Text',
            distance: 'Distance',
            area: 'Area',
            deleteAll: 'Delete all',
          },
        },
      },
    },
  },
]

export default language
