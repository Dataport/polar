import type { Coordinate } from 'ol/coordinate'
import type { PluginId } from '@/core'
import type { Color, Icon } from './theme'

export interface ContextMenuEntry {
	/**
	 * Function to be called on click.
	 */
	callback: (coordinate: Coordinate) => void

	/**
	 * Icon to be displayed for the menu entry.
	 */
	icon: Icon

	/**
	 * Unique identifier. Relevant to be able to remove an entry.
	 */
	id: string

	/**
	 * Text to be displayed for the menu entry.
	 * Accepts a locale key. If the locale is namespaced, please set {@link ContextMenuEntry.textNs | textNs} as well.
	 * If no matching locale is found, the text is displayed as-is.
	 */
	text: string

	/**
	 * Override for the color of the {@link ContextMenuEntry.icon | icon} and {@link ContextMenuEntry.text | text}.
	 */
	color?: Color

	/**
	 * Override the group of the entry resulting in a visual differentiation.
	 *
	 * @defaultValue 'default'
	 */
	group?: string

	/**
	 * Namespace for the locale key of {@link ContextMenuEntry.text | text}.
	 *
	 * @defaultValue `'core'`
	 */
	textNs?: PluginId
}
