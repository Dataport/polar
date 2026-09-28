export function dateToString(date: Date | null) {
	if (date === null) {
		return ''
	}
	return [date.getFullYear(), date.getMonth() + 1, date.getDate()]
		.map((v) => v.toString().padStart(2, '0'))
		.join('-')
}

export function stringToDate(date: string) {
	if (date.length === 0) {
		return null
	}
	const [y, m, d] = date.split('-')
	return new Date(Number(y), Number(m) - 1, Number(d))
}
