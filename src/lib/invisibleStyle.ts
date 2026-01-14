import { Feature } from 'ol'
import Style from 'ol/style/Style'

/*
 * Exports a style for vector layer features that results in invisibility.
 * Plugins that work with feature visibility ought to use this lib-functionality
 * to keep them interoperable.
 */

/**
 * Makes feature invisible.
 * To remove the invisibility, set the style to `undefined` or another style.
 *
 * Example usage:
 * feature.setStyle(InvisibleStyle)
 *
 */
export const InvisibleStyle = new Style()

/**
 * Checks if a feature is invisible.
 *
 * @param feature - The feature to check.
 */
export const isInvisible = (feature: Feature) =>
	feature.getStyle() === InvisibleStyle

/**
 * Checks if a feature is visible.
 *
 * @param feature - The feature to check.
 */
export const isVisible = (feature: Feature) =>
	feature.getStyle() !== InvisibleStyle
