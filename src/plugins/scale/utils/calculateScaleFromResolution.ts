import { METERS_PER_UNIT, type Units } from 'ol/proj/Units'

/**
 * Calculates the current scale from given parameters.
 * @param unit - projection units
 * @param resolution - resolution
 * @param dpi - device dpi
 * @returns calculated scale
 */
export function calculateScaleFromResolution(
	unit: Units,
	resolution: number,
	dpi: number
) {
	// inchesPerMetre is used to convert the resolution (distance in meters) to
	// inches per pixel (1in = 96px) so that it can be multiplied with dpi.
	const inchesPerMetre = 39.37
	const scale = Math.round(
		resolution * METERS_PER_UNIT[unit] * inchesPerMetre * dpi
	)
	return scale
}
