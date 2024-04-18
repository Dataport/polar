import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
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
            color: 'Farbe',
          },
          label: {
            line: 'Linie',
            text: 'Text',
            distance: 'Entfernung',
            area: 'Fläche',
            buttons: {
              deletaAll: 'Alle löschen',
              setColor: 'Setze {{ title }}-Farbe',
            },
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
            color: 'Color',
          },
          label: {
            line: 'Line',
            text: 'Text',
            distance: 'Distance',
            area: 'Area',
            buttons: {
              deletaAll: 'Delete all',
              setColor: 'Set {{ title }}-Color',
            },
          },
        },
      },
    },
  },
]

export default language
