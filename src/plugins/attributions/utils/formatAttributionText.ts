/**
 * Formats the attribution-string and replaces <YEAR> with the current year and
 * <MONTH> with the current month.
 *
 * @param text - the attribution text defined in the {@link MapConfiguration}.
 * @returns a formatted string, which can be displayed in the Attributions.
 */
export function formatAttributionText(text: string) {
	const now = new Date()
	return text
		.replaceAll('<YEAR>', now.getFullYear().toString())
		.replaceAll('<MONTH>', `${now.getMonth() + 1}`.padStart(2, '0'))
}
