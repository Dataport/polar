import { LanguageOption } from '@polar/lib-custom-types'

const lang: LanguageOption[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        dish: {
          modal: {
            welcome: {
              header: 'Willkommen in der Denkmalkarte Schleswig-Holstein',
              landesdachmarkeAlt:
                'Logo der Landesdachmarke "Schleswig-Holstein. Der echte Norden."',
              p1: 'Kulturdenkmale sind gesetzlich geschützt, und nachrichtlich in ein Verzeichnis, die sogenannte Denkmalliste, aufzunehmen. Die Denkmaleigenschaft ist nicht von der Eintragung in die Denkmalliste, oder von der Darstellung in der Denkmalkarte abhängig. Auch Objekte, die nicht hier verzeichnet sind, können als Kulturdenkmale kraft Gesetz (Ipsa Lege) geschützt sein, wenn sie die gesetzlichen Kriterien für die Denkmaleigenschaft erfüllen.',
              p2: 'In der Denkmalkarte werden Kulturdenkmale in der Zuständigkeit des Landesamtes für Denkmalpflege Schleswig-Holstein (Baudenkmale, Gründenkmale, Schutzzonen vom Typ Denkmalbereich) dargestellt, mit Ausnahme der Hansestadt Lübeck.',
              p3: 'Die Darstellungen in der Denkmalkarte haben informatorischen Charakter. Sie sind nicht rechtsverbindlich. Für tagesaktuelle, rechtsverbindliche Auskünfte wenden Sie sich bitte an:',
              link1: 'Landesamt für Denkmalpflege Schleswig-Holstein',
              link2: 'Planungs- und Genehmigungsverfahren',
              p4: 'Die Nutzung der Denkmalkarte ersetzt nicht die förmliche Beteiligung der jeweils zuständigen Denkmalbehörde in',
              confirmRead:
                'Hiermit bestätige ich, dass ich die Informationen zur Kenntnis genommen habe.',
              closeInfo: "Los geht's!",
            },
            hints: {
              /* NOTE
               * There's lots of special formatting and links in that
               * text block, and no multilingual support in sight.
               * For that reason, this part is currently maintained
               * in the Hints.vue file, until the need arises.
               */
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
        dish: {
          modal: {},
        },
      },
    },
  },
]

export default lang
