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
        lasso: 'Lasso',
        edit: 'Bearbeiten',
        translate: 'Verschieben',
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
        metres: 'm',
        metresArea: 'm / m²',
        kilometres: 'km',
        kilometresArea: 'km / km²',
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
      lasso: {
        layerRejected:
          'Die Antwort des Layers "{{id}}" konnte nicht gelesen werden. Es wurden keine Geometrien aus diesem Layer bezogen.',
        notInZoomRange:
          'Der Layer "$t({{serviceName}})" wurde nicht für die Lasso-Funktion genutzt, da er auf der derzeitigen Zoomstufe nicht aktivierbar ist. Bitte passen Sie die Zoomstufe an, um die Lasso-Funktion zu nutzen.',
        fatalError:
          'Ein unerwarteter Fehler ist in der Verarbeitung der Lasso-Daten aufgetreten.',
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
        lasso: 'Lasso',
        edit: 'Edit',
        translate: 'Translate',
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
      lasso: {
        layerRejected:
          'The response of layer "{{id}}" could not be read. No geometries were fetched from that layer.',
        notInZoomRange:
          'The layer "$t({{serviceName}})" was not used for the lasso as it is not activatable on the current zoom level. Please change the zoom level to use the lasso.',
        fatalError:
          'An unexpected error occured in the processing of lasso data.',
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
