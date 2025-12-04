export function focusFirstResult(
	searchResultsLength: number,
	shadowRoot: ShadowRoot
) {
	for (let i = 0; i < searchResultsLength; i++) {
		const firstFocusableElement = shadowRoot.getElementById(
			`polar-plugin-address-search-results-feature-${i}-0`
		)
		console.warn(firstFocusableElement)
		if (firstFocusableElement) {
			firstFocusableElement.focus()
			break
		}
	}
}
