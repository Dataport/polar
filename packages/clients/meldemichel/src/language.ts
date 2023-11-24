// SKAT modeled by their ID; no semantic value for client
/* eslint-disable @typescript-eslint/naming-convention */
import { LanguageOption } from '@polar/lib-custom-types'
import { REPORT_STATUS, TIME_FILTER, SKAT } from './enums'

/*
  NOTE this is a lookup of the old localization.
  TODO this comment must be deleted after parts were used where applicable.
  NOTE delete parts you used further below in the actual data
    'title': 'Meldemichel',
    'tooltip.multiple.header': 'Mehrere Anliegen',
    'tooltip.multiple.body': 'Klick zum Zoomen',
    'tooltip.finalMultiple.header': 'Mehrere Anliegen',
    'tooltip.finalMultiple.body': 'Klick öffnet Details',
    'sidebar.report.close': 'Zurück zur Kartenansicht',
    'sidebar.report.back':
      'Zurück zur Listenansicht der Meldungen',
    'sidebar.report.previous':
      'Vorherige Meldung in Auswahl aufrufen',
    'sidebar.report.next':
      'Nächste Meldung in Auswahl aufrufen',
    'sidebar.report.response': 'Rückmeldung',
    'sidebar.filter.close': 'Zurück zur Kartenansicht',
    'sidebar.filter.categories': 'Kategorien',
    'sidebar.filter.status': 'Status',
    'sidebar.filter.timeframe': 'Zeitraum',
    'sidebar.filter.from': 'Von',
    'sidebar.filter.to': 'Bis',
    'sidebar.filter.information':
      '90 Tage nach Bearbeitungsende werden die Meldungen gelöscht.',
    'skat.all': 'Alle anwählen/abwählen',
    'report.button.ariaDescription':
      'Öffnet eine neue Seite, auf welcher ein neues Anliegen gemeldet werden kann.',
*/

const language: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      meldemichel: {
        attributions: {
          stadtplan:
            'Kartografie Stadtplan: <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>',
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
        },
        layers: {
          stadtplan: 'Stadtplan',
          luftbilder: 'Luftbildansicht',
          reports: 'Meldungen',
          hamburgBorder: 'Stadtgrenze Hamburg',
        },
        skat: {
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
        },
        status: {
          [REPORT_STATUS.PROCESSING]: 'In Bearbeitung',
          [REPORT_STATUS.PROCESSED]: 'Bearbeitet',
        },
        time: {
          [TIME_FILTER.NONE]: 'Keine Einschränkung',
          [TIME_FILTER.DAYS_7]: 'Die letzten 7 Tage',
          [TIME_FILTER.DAYS_30]: 'Die letzten 30 Tage',
          [TIME_FILTER.SELECTABLE]: 'Zeitraum wählen',
        },
      },
      plugins: {
        geoLocation: {
          toast: {
            notInBoundary:
              'Das System konnte Sie leider nicht in Hamburg verorten. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
            boundaryError:
              'Die Verortung ist fehlgeschlagen. Bitte benutzen Sie Karte und Suche, um einen Schaden innerhalb von Hamburg zu melden.',
          },
        },
        gfi: {
          list: {
            header: 'Meldungsliste',
            entry: 'Meldung',
            emptyView:
              'Im aktuellen Kartenausschnitt sind keine Meldungen enthalten.',
          },
          noActiveLayer:
            'Die Meldungen sind derzeit ausgeschaltet. Sie können Sie über die Kartenauswahl (Buch-Symbol in der Werkzeugleiste) wieder einschalten.',
        },
        iconMenu: {
          hints: {
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
  const knownLocaleSKAT = Object.keys(languageOption.resources.meldemichel.skat)
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
