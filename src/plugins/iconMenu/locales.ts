import type { Locale } from '@/core'

/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the iconMenu plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/iconMenu
 */
/* eslint-enable tsdoc/syntax */

export const resourcesDe = {
	mobileCloseButton: '{{plugin}} schließen',

	/** Allows overriding the hints displayed as the tooltip, the aria-label or also sometimes the label. */
	hints: {
		attributions: 'Quellennachweis',
		draw: 'Zeichenwerkzeuge',
		filter: 'Filter',
		layerChooser: 'Kartenauswahl',
		gfi: 'Objektliste',
	},
} as const

export const resourcesEn = {
	mobileCloseButton: 'Close {{plugin}}',

	/** Allows overriding the hints displayed as the tooltip, the aria-label or also sometimes the label. */
	hints: {
		attributions: 'Attributions',
		draw: 'Draw tools',
		filter: 'Filter',
		layerChooser: 'Choose map',
		gfi: 'Feature list',
	},
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
