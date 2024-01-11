/*
 * Vuetify creates a stylesheet upon setup. To have it correctly applied to the
 * map client, it needs to be pulled to the shadow realm.
 */
export const pullVuetifyStyleToShadow = (shadowRoot: ShadowRoot) => {
  const vuetifyStyle = document.getElementById('vuetify-theme-stylesheet')
  if (vuetifyStyle === null) {
    console.error(
      `@polar/core: The POLAR map client did not find the vuetify theme stylesheet. It is supposed to be created programmatically. This is probably a bug in POLAR.`
    )
    return
  }
  shadowRoot.appendChild(vuetifyStyle)
}
