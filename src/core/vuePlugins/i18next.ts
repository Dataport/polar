import { toMerged } from 'es-toolkit'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import I18NextVue from 'i18next-vue'
import type { Plugin } from 'vue'
import locales from '../locales'
import type { Locale } from '../types'

export const I18Next: Plugin = {
	async install(
		app,
		options?: { initialLanguage?: string; locales?: Locale[] }
	) {
		app.use(I18NextVue, { i18next })

		const localeOptions = options?.locales
		const configuredLocales = Array.isArray(localeOptions)
			? locales.map((locale) => {
					const localeOption = localeOptions.find((l) => l.type === locale.type)
					return {
						type: locale.type,
						resources: toMerged(
							locale.resources,
							localeOption ? localeOption.resources : {}
						),
					}
				})
			: locales
		const supportedLngs: string[] = configuredLocales.map(({ type }) => type)

		i18next.use(LanguageDetector)
		await i18next
			.init({
				resources: configuredLocales.reduce(
					(accumulator, { type, resources }) => {
						accumulator[type] = resources
						return accumulator
					},
					{}
				),
				detection: {
					lookupQuerystring: 'lng',
					order: ['querystring', 'navigator', 'htmlTag'],
				},
				load: 'languageOnly',
				fallbackLng: supportedLngs[0],
				fallbackNS: 'common',
				ns: ['common'],
				supportedLngs,
				...(options?.initialLanguage ? { lng: options.initialLanguage } : {}),
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
