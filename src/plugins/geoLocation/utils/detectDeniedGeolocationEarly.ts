export function detectDeniedGeolocationEarly() {
	return navigator.permissions
		.query({ name: 'geolocation' })
		.then(({ state }) => state === 'denied')
		.catch(() => {
			// Can't help it, we'll figure this one out later.
			return false
		})
}
