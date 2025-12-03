/* eslint-disable tsdoc/syntax */
/**
 * This is the documentation for the locales keys in the layerChooser plugin.
 * These locales are *NOT* exported, but documented only.
 *
 * @module locales/plugins/layerChooser
 */
/* eslint-enable tsdoc/syntax */

import { PluginId } from './types'
import type { Locale } from '@/core'

export const resourcesDe = {
	backgroundTitle: 'Hintergrundkarten',
	maskTitle: 'Fachdaten',
	layerHeader: 'Auswahl sichtbarer Ebenen für Layer "{{name}}"',
	layerOptions: 'Optionen für Kartenmaterial',
	legend: {
		title: 'Legende',
		to: 'Legendenbild zu "{{name}}"',
		open: `$t(legend.to, {ns: ${PluginId}}) öffnen`,
	},
	returnToLayers: 'Zurück',
} as const

export const resourcesEn = {
	backgroundTitle: 'Background maps',
	maskTitle: 'Subject data',
	layerHeader: 'Visible layer selection for layer "{{name}}"',
	layerOptions: 'Map data options',
	legend: {
		title: 'Legend',
		to: '"{{name}}" legend image',
		open: `Open $t(legend.to, {ns: ${PluginId}})`,
	},
	returnToLayers: 'Back',
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
