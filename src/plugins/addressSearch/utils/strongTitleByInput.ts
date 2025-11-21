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
