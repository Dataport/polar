export function focusFirstResult() {
  const firstElement =
    // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
    (document.querySelector('[data-app]') as ShadowRoot).getElementById(
      'polar-plugin-address-search-results-feature-0-0'
    )
  if (firstElement) {
    firstElement.focus()
  }
}
