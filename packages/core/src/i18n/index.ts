import i18next, { init, use } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Vue from 'vue'
import VueI18Next from 'i18next-vue'
import locales from '../locales'

use(LanguageDetector)
Vue.use(VueI18Next, { i18next })

const supportedLngs = locales.map(({ type }) => type)

/**
 * @param initialLanguage - If given, the initial language set in the mapConfiguration.
 */
export default (initialLanguage?: string) =>
  init({
    resources: locales.reduce((accumulator, { type, resources }) => {
      accumulator[type] = resources
      return accumulator
    }, {}),
    detection: {
      lookupQuerystring: 'lng',
      order: ['querystring', 'navigator', 'htmlTag'],
    },
    load: 'languageOnly',
    fallbackLng: supportedLngs[0],
    fallbackNS: 'common',
    ns: ['common'],
    supportedLngs,
    ...(initialLanguage ? { lng: initialLanguage } : {}),
  })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info(`i18next: Successfully initialized.`)
    })
    .catch((error: Error) => {
      console.error('i18next: Error while initializing.', error)
    })
