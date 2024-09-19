import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        draw: {
          mode: {
            none: 'Keine Interaktion',
            draw: 'Zeichnen',
            write: 'Zeichnen und Schreiben',
            edit: 'Bearbeiten',
            delete: 'Löschen',
          },
          drawMode: {
            circle: 'Kreis',
            lineString: 'Linie',
            point: 'Punkt',
            polygon: 'Polygon',
            text: 'Text',
          },
          options: {
            stroke: 'Linienfarbe',
          },
          title: {
            mode: 'Modus',
            drawMode: 'Zeichenmodus',
            options: 'Zeichenoptionen',
          },
          label: {
            textSize: 'Textgröße (px) wählen:',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        draw: {
          mode: {
            none: 'No interaction',
            draw: 'Draw',
            write: 'Draw and write',
            edit: 'Edit',
            delete: 'Delete',
          },
          drawMode: {
            circle: 'Circle',
            lineString: 'Line',
            point: 'Point',
            polygon: 'Polygon',
            text: 'Text',
          },
          options: {
            stroke: 'Stroke color',
          },
          title: {
            mode: 'Mode',
            drawMode: 'Drawing mode',
            options: 'Draw options',
          },
          label: {
            textSize: 'Choose text size (px):',
          },
        },
      },
    },
  },
]

export default language
