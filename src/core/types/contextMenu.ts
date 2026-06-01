import type { Coordinate } from 'ol/coordinate'

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
	 */
	text: string

	/**
	 * Override for the color of the {@link ContextMenuEntry.icon | icon} and {@link ContextMenuEntry.text | text}.
	 */
	color?: Color
}
