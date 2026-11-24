export function strongTitleByInput(title: string, inputValue: string) {
	const index = title.toLowerCase().indexOf(inputValue.toLowerCase())
	if (index === -1) {
		return title
	}
	return (
		title.substring(0, index) +
		'<strong>' +
		title.substring(index, index + inputValue.length) +
		'</strong>' +
		title.substring(index + inputValue.length)
	)
}

if (import.meta.vitest) {
	const { expect, test } = import.meta.vitest

	test('wraps the matched part of the title in <strong>', () => {
		expect(strongTitleByInput('Hamburg', 'ham')).toBe(
			'<strong>Ham</strong>burg'
		)
	})

	test('matches case-insensitively but keeps the original casing', () => {
		expect(strongTitleByInput('Hamburg', 'BUR')).toBe(
			'Ham<strong>bur</strong>g'
		)
	})

	test('returns the title unchanged when there is no match', () => {
		expect(strongTitleByInput('Hamburg', 'xyz')).toBe('Hamburg')
	})
}
