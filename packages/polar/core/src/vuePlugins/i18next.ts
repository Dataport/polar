import type { Plugin } from 'vue'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import I18NextVue from 'i18next-vue'
import locales from '../locales'

export const I18Next: Plugin = {
	async install(app, initialLanguage?: string) {
		app.use(I18NextVue, { i18next })

		const supportedLngs = locales.map(({ type }) => type)

		i18next.use(LanguageDetector)
		await i18next
			.init({
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
			.catch((error: unknown) => {
				console.error('i18next: Error while initializing.', error)
			})
	},
}
