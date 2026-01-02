import Style from 'ol/style/Style'
import { Feature } from 'ol'

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

/**
 * Hides a feature.
 *
 * @param feature - The feature to hide.
 */
export const hideFeature = (feature: Feature) => {
	if (isVisible(feature)) {
		feature.setStyle(InvisibleStyle)
	}
}

/**
 * Shows a feature.
 *
 * @param feature - The feature to show.
 */
export const showFeature = (feature: Feature) => {
	if (isInvisible(feature)) {
		feature.setStyle()
	}
}
