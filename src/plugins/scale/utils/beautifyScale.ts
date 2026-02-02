/**
 * Rounds the scale number so that the scale can be displayed in a beautified format in the map.
 * @param scaleNumber - the scale to be beautified
 * @param language - the language according to which the number is formatted
 * @returns the scale in a beautified format (=rounded based on its value)
 */
export const beautifyScale = (scaleNumber: number, language: string) =>
	`1 : ${new Intl.NumberFormat(language, { maximumFractionDigits: 0 }).format(
		scaleNumber > 10000
			? Math.round(scaleNumber / 500) * 500
			: scaleNumber > 1000
				? Math.round(scaleNumber / 50) * 50
				: scaleNumber
	)}`
