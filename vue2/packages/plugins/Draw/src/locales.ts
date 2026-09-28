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
        duplicate: 'Duplizieren',
        cut: 'Polygone auftrennen',
        merge: 'Polygone kombinieren',
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
      metaInformationRetrieval: {
        errorToast:
          'Der Bezug von Metadaten zur gezeichneten Geometrie ist fehlgeschlagen. Die Geometrie wird ohne Metadaten weitergereicht.',
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
        internalError:
          'Ein unerwarteter Fehler ist in der Verarbeitung der Lasso-Daten aufgetreten.',
      },
      cut: {
        error: {
          cutFailed:
            'Das Polygon konnte aufgrund eines unbekannten Fehlers leider nicht geschnitten werden.',
        },
        warn: {
          unevenCut:
            'Leider konnte kein Schnitt hergestellt werden, da entweder der Start- oder Endpunkt der Schnittkante innerhalb des zu schneidenden Polygons lag, oder kein Polygon geschnitten wurde. Bitte versuchen Sie es erneut.',
        },
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
        duplicate: 'Duplicate',
        cut: 'Cut polygons',
        merge: 'Merge polygons',
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
        internalError:
          'An unexpected error occured in the processing of lasso data.',
      },
      cut: {
        error: {
          cutFailed: 'The polygon could not be cut due to unknown reasons.',
        },
        warn: {
          unevenCut:
            'No cut could be produced since either the start or end point of the cut line is within the polygon to cut, or no polygon was cut. Please try again.',
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
