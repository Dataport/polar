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
          delete: {
            button: 'Alle löschen',
            information:
              'Klicke auf die Ecken einer Messung, um diese zu löschen.\nLinien benötigen mindestens 2, Polygone mindestens 3.',
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
          delete: {
            button: 'Delete all',
            information:
              'Click on the corners of a measurement to delete them.\nLines need at least 2, Polygons at least 3.',
          },
        },
      },
    },
  },
]

export default language
