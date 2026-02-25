import type { Locale } from '@/core'

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the attributions plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/attributions
 */
/* eslint-enable tsdoc/syntax */

/**
 * German locales for attributions plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesDe = {
	button: {
		closeTitle: 'Quellennachweis ausblenden',
		openTitle: 'Quellennachweis einblenden',
	},
	sourceCode:
		'<span><a href="https://github.com/Dataport/polar" target="_blank">Quellcode</a> lizenziert unter <a href="https://github.com/Dataport/polar/blob/main/LICENSE" target="_blank">EUPL v1.2</a></span>',
	title: 'Quellennachweis',
} as const

/**
 * English locales for attributions plugin.
 * For overwriting these values, use the plugin's ID as namespace.
 */
export const resourcesEn = {
	button: {
		closeTitle: 'Hide Attributions',
		openTitle: 'Show Attributions',
	},
	sourceCode:
		'<span><a href="https://github.com/Dataport/polar" target="_blank">Source code</a> licensed under <a href="https://github.com/Dataport/polar/blob/main/LICENSE" target="_blank">EUPL v1.2</a></span>',
	title: 'Attributions',
} as const

// first type will be used as fallback language
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
