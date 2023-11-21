export function focusFirstResult(featureListsLength: number) {
  for (let i = 0; i < featureListsLength; i++) {
    const firstFocusableElement =
      // @ts-expect-error | Type conversion is fine here as the querySelector method is monkeyPatched in core/createMap
      (document.querySelector('[data-app]') as ShadowRoot).getElementById(
        `polar-plugin-address-search-results-feature-${i}-0`
      )
    if (firstFocusableElement) {
      firstFocusableElement.focus()
      break
    }
  }
}
