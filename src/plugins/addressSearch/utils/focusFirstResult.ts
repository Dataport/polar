export function focusFirstResult(
	searchResultsLength: number,
	shadowRoot: ShadowRoot,
	event?: KeyboardEvent
) {
	for (let i = 0; i < searchResultsLength; i++) {
		const firstFocusableElement = shadowRoot.getElementById(
			`polar-plugin-address-search-results-feature-${i}-0`
		)
		console.warn(firstFocusableElement)
		if (firstFocusableElement) {
			firstFocusableElement.focus()
			// prevent list scrolling on newly focused element
			event?.preventDefault()
			break
		}
	}
}
