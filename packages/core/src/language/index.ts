import i18next, { init, use } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Vue from 'vue'
import VueI18Next from '@panter/vue-i18next'
import de from './locales/de'
import en from './locales/en'

use(LanguageDetector)
Vue.use(VueI18Next)

/**
 * @param initialLanguage - If given, the initial language set in the mapConfiguration.
 */
export default function initializeI18Next(
  initialLanguage?: string
): VueI18Next {
  init({
    resources: { de, en },
    detection: {
      lookupQuerystring: 'lng',
      order: ['querystring', 'navigator', 'htmlTag'],
    },
    load: 'languageOnly',
    fallbackLng: 'de',
    fallbackNS: 'common',
    ns: ['common'],
    supportedLngs: ['de', 'en'],
    ...(initialLanguage ? { lng: initialLanguage } : {}),
  })
    .then(() => {
      // eslint-disable-next-line no-console
      console.info(`i18next: Successfully initialized.`)
    })
    .catch((error: Error) => {
      console.error('i18next: Error while initializing.', error)
    })

  return new VueI18Next(i18next)
}
