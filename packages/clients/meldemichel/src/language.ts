// SKAT modeled by their ID; no semantic value for client
/* eslint-disable @typescript-eslint/naming-convention */
import { LanguageOption } from '@polar/lib-custom-types'
import { REPORT_STATUS, TIME_FILTER, SKAT } from './enums'

const skat = {
  100: 'Wege und Straßen',
  101: 'Schlagloch und Wegeschaden',
  102: 'Verunreinigung und Vandalismus',
  103: 'Wildwuchs und Überwuchs',
  104: 'Beschädigtes Verkehrszeichen',
  105: 'Beschädigte Brücke, Tunnel, Mauer, Treppe',
  106: 'Beschädigte Geländer, Poller, Fahrradständer, Sitzgelegenheit',
  111: 'Schrottfahrräder',
  112: 'Abgemeldete Fahrzeuge',
  113: 'Radverkehr',
  114: 'Stadtwald Hamburg',
  115: 'Stadtwald: Schäden am Baumbestand',
  116: 'Stadtwald: Schäden an Einrichtungen',
  117: 'Stadtwald: Wegeschäden',
  118: 'Stadtwald: Verschmutzung / Müll',
  119: 'Stadtwald: Illegale Aktivitäten',
  120: 'Stadtwald: Sonstige Schäden',
  200: 'Ampeln und Leuchten',
  202: 'Ampel gestört',
  203: 'beleuchtetes Schild gestört',
  204: 'Straßenbeleuchtung ausgefallen',
  205: 'Straßenbeleuchtung tagsüber in Betrieb',
  400: 'Grünanlagen und Spielplätze',
  401: 'Baumschaden',
  402: 'Spielgeräteschaden',
  500: 'Siele und Gewässer',
  501: 'Gully-Schaden',
  502: 'Graben',
  503: 'Gewässerverunreinigung',
}

const status = {
  [REPORT_STATUS[0]]: 'In Bearbeitung',
  [REPORT_STATUS[1]]: 'Bearbeitet',
}

const filterCategory = {
  skat,
  statu: status,
  title: { skat: 'Kategorien', statu: 'Status' },
}

export const meldemichelDe = {
  attributions: {
    stadtplan:
      'Kartografie Stadtplan: <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>',
    stadtwald:
      'Kartografie Stadtwald: <a target="_blank" href="https://www.hamburg.de/politik-und-verwaltung/behoerden/bukea">Freie und Hansestadt Hamburg, Behörde für Umwelt, Klima, Energie und Agrarwirtschaft (BUKEA)</a>',
    luftbilder:
      'Kartografie Luftbilder: <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>',
    reports: 'Meldungen durch Bürger',
  },
  gfi: {
    title: 'Meldung',
    skat: 'Kategorie',
    beschr: 'Beschreibung',
    rueck: 'Rückmeldung',
    start: 'Gemeldet am',
    statu: 'Status',
    tooltip: {
      multiHeader: 'Mehrere Anliegen',
      multiBody: 'Klick zum Zoomen',
      multiBodyUnresolvable: 'Klick zum Öffnen',
    },
  },
  layers: {
    stadtplan: 'Stadtplan',
    stadtwald: 'Stadtwald',
    luftbilder: 'Luftbildansicht',
    reports: 'Meldungen',
    hamburgBorder: 'Stadtgrenze Hamburg',
  },
  skat,
  status,
  time: {
    [TIME_FILTER.NONE]: 'Keine Einschränkung',
    [TIME_FILTER.DAYS_7]: 'Die letzten 7 Tage',
    [TIME_FILTER.DAYS_30]: 'Die letzten 30 Tage',
    [TIME_FILTER.SELECTABLE]: 'Zeitraum wählen',
  },
} as const

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      meldemichel: meldemichelDe,
      plugins: {
        filter: {
          layerName: {
            6059: 'Meldungen — Filter',
            6061: 'Meldungen (Stage) — Filter',
          },
          category: {
            6059: filterCategory,
            6061: filterCategory,
          },
        },
        geoLocation: {
          toast: {
            notInBoundary:
              'Das System konnte Sie leider nicht in Hamburg verorten. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
            boundaryError:
              'Die Verortung ist fehlgeschlagen. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
          },
        },
        gfi: {
          header: {
            close: 'Zurück zur Listenansicht der Meldungen',
          },
          list: {
            header: 'Meldungsliste',
            entry: 'Meldung',
            emptyView:
              'Im aktuellen Kartenausschnitt sind keine Meldungen enthalten.',
            pagination: {
              currentPage:
                'Aktuelle Seite, Seite {{page}} von {{maxPage}} der Schadensmeldungen',
              page: 'Öffne Seite {{page}} von {{maxPage}} der Schadensmeldungen',
              next: 'Nächste Seite öffnen',
              previous: 'Vorherige Seite öffnen',
              wrapper: 'Seitenauswahl',
            },
          },
          noActiveLayer:
            'Die Meldungen sind derzeit ausgeschaltet. Sie können Sie über die Kartenauswahl (Buch-Symbol in der Werkzeugleiste) wieder einschalten.',
        },
        iconMenu: {
          hints: {
            filter: 'Filter',
            gfi: 'Meldungsliste',
          },
        },
        pins: {
          toast: {
            notInBoundary:
              'Es können nur Koordinaten innerhalb von Hamburg gewählt werden.',
          },
        },
      },
    },
  },
]

// test for enum/locale synchronity; error on mismatch
language.forEach((languageOption) => {
  const knownLocaleSKAT = Object.keys(skat)
  const knownEnumSKAT = SKAT.map((n) => String(n))
  if (knownLocaleSKAT.sort().join(',') !== knownEnumSKAT.sort().join(',')) {
    throw new Error(
      `POLAR Meldemichel: Error in language.ts/enums.ts: SKAT and Locales not in sync for language "${
        languageOption.type
      }". Affected SKAT: ${knownLocaleSKAT
        .filter((x) => !knownEnumSKAT.includes(x))
        .concat(knownEnumSKAT.filter((x) => !knownLocaleSKAT.includes(x)))}`
    )
  }
})

export default language
