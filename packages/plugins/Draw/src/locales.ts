import { Locale } from '@polar/lib-custom-types'

export const resourcesDe = {
  plugins: {
    draw: {
      mode: {
        none: 'Keine Interaktion',
        draw: 'Zeichnen',
        measure: 'Zeichnen und Messen',
        write: 'Zeichnen und Schreiben',
        writeAndMeasure: 'Zeichnen, Schreiben und Messen',
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
      measureMode: {
        none: 'Keine Messung',
        metres: 'm / m²',
        kilometres: 'km / km²',
        hectares: 'km / ha',
      },
      options: {
        stroke: 'Linienfarbe',
      },
      title: {
        drawMode: 'Zeichenmodus',
        mode: 'Modus',
        measureMode: 'Messmodus',
        options: 'Zeichenoptionen',
      },
      label: {
        textSize: 'Textgröße (px) wählen:',
      },
    },
  },
} as const

export const resourcesEn = {
  plugins: {
    draw: {
      mode: {
        none: 'No interaction',
        draw: 'Draw',
        measure: 'Draw and measure',
        write: 'Draw and write',
        writeAndMeasure: 'Draw, write and measure',
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
      measureMode: {
        none: 'No measure',
        metres: 'm',
        metresArea: 'm / m²',
        kilometres: 'km',
        kilometresArea: 'km / km²',
        hectares: 'km / ha',
      },
      options: {
        stroke: 'Stroke color',
      },
      title: {
        drawMode: 'Drawing mode',
        mode: 'Mode',
        measureMode: 'Measure mode',
        options: 'Draw options',
      },
      label: {
        textSize: 'Choose text size (px):',
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
