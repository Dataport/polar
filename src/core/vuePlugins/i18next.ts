import type { Plugin } from 'vue'

import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import I18NextVue from 'i18next-vue'

import sharedLocales from '@/locales'

import locales from '../locales'

export const CoreId = 'core'
export const SharedId = 'shared'

export const I18Next: Plugin = {
	async install(app) {
		app.use(I18NextVue, { i18next })

		i18next.use(LanguageDetector)
		try {
			await i18next.init({
				resources: Object.fromEntries(
					locales.map(({ type, resources }) => [type, { core: resources }])
				),
				detection: {
					lookupQuerystring: 'lng',
					order: ['querystring', 'navigator', 'htmlTag'],
				},
				load: 'languageOnly',
				fallbackLng: locales[0]?.type,
				ns: [CoreId],
				supportedLngs: locales.map(({ type }) => type),
			})

			// This is no plugin itself, but bundled for usage of all plugins
			sharedLocales.forEach((lng) => {
				i18next.addResourceBundle(lng.type, SharedId, lng.resources, true)
			})

			// eslint-disable-next-line no-console
			console.info(`Successfully initialized i18next.`)
		} catch (error: unknown) {
			console.error('Error while initializing:', error)
		}
	},
}
