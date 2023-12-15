export const pullPolarStyleToShadow = (shadowRoot: ShadowRoot) => {
  // @ts-expect-error | 'TS2339: Property 'env' does not exist on type 'ImportMeta'.' - It does since we're using vite as a bundler.
  const devMode = import.meta.env.DEV
  // move polar css to Shadow DOM (customer has to import it)
  const attributeName = devMode ? 'style' : 'link'
  const stylesheets = [...document.getElementsByTagName(attributeName)]
  const stylesheetDataAttribute = devMode ? 'data-vite-dev-id' : 'data-polar'
  const polarStylesheets = stylesheets.filter((el) =>
    el.getAttribute(stylesheetDataAttribute)
  )
  if (polarStylesheets.length > 0) {
    polarStylesheets
      // NOTE: Nodes have to be cloned due to a browser bug https://stackoverflow.com/questions/62129243/external-font-does-not-load-when-link-is-loaded-from-inside-the-shadowdom
      .map((el) => el.cloneNode(true))
      .forEach((style) => shadowRoot.appendChild(style))
  } else {
    console.error(
      `core.createMap: Couldn't find required stylesheets, map won' render. ${
        devMode
          ? 'Something must have gone wrong with the setup. Please contact an administrator.'
          : 'Please add "data-polar" to the respective link-tag. The use value for the attribute can be chosen arbitrarily.'
      }`
    )
  }
}
