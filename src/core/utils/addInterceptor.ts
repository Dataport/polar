export function addInterceptor(
	secureServiceUrlRegex: RegExp,
	interceptorHeadersCallback: () => Headers
) {
	// NOTE: Not applicable here.
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const { fetch: originalFetch } = window

	// If interceptors for XMLHttpRequest or axios are needed, add them here.
	window.fetch = (resource, originalConfig) => {
		let config = originalConfig
		const interceptorHeaders = interceptorHeadersCallback()

		if (
			Object.keys(interceptorHeaders).length > 0 &&
			typeof resource === 'string' &&
			resource.match(secureServiceUrlRegex)
		) {
			const headers = new Headers(originalConfig?.headers)
			interceptorHeaders.entries().forEach(([key, value]) => {
				headers.append(key, value)
			})

			config = {
				...originalConfig,
				headers,
			}
		}

		return originalFetch(resource, config)
	}
}
