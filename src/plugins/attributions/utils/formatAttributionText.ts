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

if (import.meta.vitest) {
	const { afterEach, beforeEach, expect, test, vi } = import.meta.vitest

	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	test('replaces all <YEAR> and zero-padded <MONTH> placeholders', () => {
		vi.setSystemTime(new Date('2026-04-20'))

		expect(formatAttributionText('© <YEAR> – updated <MONTH>/<YEAR>')).toBe(
			'© 2026 – updated 04/2026'
		)
	})

	test('keeps a two-digit month unpadded', () => {
		vi.setSystemTime(new Date('2026-12-14'))

		expect(formatAttributionText('<MONTH>')).toBe('12')
	})
}
