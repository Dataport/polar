/**
 * Returns a `Date` object from a string using the parsing instruction described with pattern.
 *
 * @param date - The date string to parse from
 * @param pattern - The pattern to parse with
 * @returns Parsed Date object
 */
export function parseDateWithPattern(date: string, pattern: string): Date {
	const result = Object.fromEntries(['Y', 'M', 'D'].map((key) => [key, '']))
	pattern.split('').forEach((token, index) => {
		if (token in result && typeof result[token] === 'string') {
			result[token] += date[index] || ''
		}
	})
	return new Date(Number(result.Y), Number(result.M) - 1, Number(result.D))
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	test.for([
		{
			date: '2025-07-01',
			pattern: 'YYYY-MM-DD',
			expected: new Date('Jul 1, 2025'),
		},
		{
			date: '202-521-12X',
			pattern: 'YYY-YDM-MD-',
			expected: new Date('Nov 22, 2025'),
		},
		{
			date: '2026-01',
			pattern: 'YYYY-MM-DD',
			expected: new Date('Dec 31, 2025'),
		},
	])(
		'parseDateWithPattern works as expected',
		({ date, pattern, expected }) => {
			expect(parseDateWithPattern(date, pattern)).toEqual(expected)
		}
	)
}
