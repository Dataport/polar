/**
 * Checks if a string is a possibly valid HTTP or HTTPS URL.
 *
 * @param string - String to check
 * @returns true if the string could be an HTTP(S) URL, false otherwise
 */
export function isValidHttpUrl(string) {
	let url

	try {
		url = new URL(string)
	} catch {
		return false
	}

	return url.protocol === 'http:' || url.protocol === 'https:'
}
