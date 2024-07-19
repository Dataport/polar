// other names required
import { LanguageOption } from '@polar/lib-custom-types'

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        iconMenu: {
          hints: {
            geometrySearch: 'Geometriesuche',
          },
        },
        geometrySearch: {
          draw: {
            title: 'Zeichenmodus',
            description: {
              Point:
                'Klicken Sie in die Karte, um Ortsnamen und Literatur zu einer Punktkoordinate abzufragen. $t(plugins.geometrySearch.draw.description.Common)',
              Polygon:
                'Klicken Sie wiederholt in die Karte, um eine Fläche zu zeichnen, zu der Ortsnamen und Literatur abgefragt werden. Doppelklick beendet eine Zeichnung. $t(plugins.geometrySearch.draw.description.Common)',
              Common: 'Neue Zeichnungen verwerfen vorangehende Ergebnisse.',
            },
          },
          tooltip: {
            title: 'Orte',
            highlight: {
              cold: 'Auf Fund zoomen',
              heat: 'Auf Funde zoomen und nach Relevanz färben',
            },
            focusSearch: 'Neue Suche nach allen Geometrien zu dieser Geometrie',
            textSearch: 'Suche nach allen Geometrien zu diesem Text',
            badge: {
              textToToponym:
                'Anzahl der Ortsnennungen zu den aktuell angezeigten Geometrien in diesem Text',
              toponymInText:
                'Anzahl der Funde dieses Ortes im aktuell geöffneten Text',
              toponymToText:
                'Anzahl der Ortsnennungen dieses Ortes über alle aktuell betrachteten Texte',
              textInToponym:
                'Anzahl der Funde des aktuellen geöffneten Ortes in diesem Text',
            },
          },
          results: {
            title: 'Funde',
            byLocation: 'Ort',
            byText: 'Text',
            none: 'Keine Suchergebnisse',
          },
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        iconMenu: {
          hints: {
            geometrySearch: 'Geometry search',
          },
        },
        geometrySearch: {
          draw: {
            title: 'Draw mode',
            description: {
              Point:
                'Click somewhere in the map to request location names and literature to a point coordinate. $t(plugins.geometrySearch.draw.description.Common)',
              Polygon:
                'Click repeatedly in the map to draw an area to request location names and literature to. Double click finishes an area. $t(plugins.geometrySearch.draw.description.Common)',
              Common: 'New drawings discard previous results.',
            },
          },
          tooltip: {
            title: 'Locations',
            highlight: {
              cold: 'Zoom to finding',
              heat: 'Zoom to findings and color by relevance',
            },
            focusSearch: 'New search for all geometries to this geometry',
          },
          results: {
            title: 'Findings',
            byLocation: 'Place',
            byText: 'Text',
            none: 'No search results',
          },
        },
      },
    },
  },
]

export default language
