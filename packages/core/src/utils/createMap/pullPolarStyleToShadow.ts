const defaultStylePath = './style.css'

export const pullPolarStyleToShadow = (
  shadowRoot: ShadowRoot,
  stylePath = defaultStylePath
) => {
  // @ts-expect-error | 'TS2339: Property 'env' does not exist on type 'ImportMeta'.' - It does since we're using vite as a bundler.
  if (import.meta.env.DEV) {
    const stylesheets = [...document.getElementsByTagName('style')]
    const polarStylesheets = stylesheets.filter((el) =>
      el.getAttribute('data-vite-dev-id')
    )
    // TODO: This is a temporary workaround until diplanung-style provides the rule this way; this should not find its way onto main, but it will, and, if you read it, probably did
    // TODO: For prod mode, add the :host to the polar.css by hand
    polarStylesheets.forEach((style) => {
      if (
        style.attributes['data-vite-dev-id'].textContent.endsWith(
          'diplanung-style/src/scss/main.scss'
        )
      ) {
        style.textContent = `:host,${style.textContent}`
      }
      shadowRoot.appendChild(style)
    })
  } else {
    const link = document.createElement('link')
    link.href = stylePath
    link.rel = 'stylesheet'
    link.onerror = (e) =>
      console.error(
        `@polar/core: Couldn't find required stylesheets, map won't render. ${
          stylePath === defaultStylePath
            ? `The default stylePath ${defaultStylePath} did not work. Please check @polar/core's documentation of 'stylePath' on how this can be configured.`
            : `It seems the provided stylePath (${stylePath}) did not work. Please verify its correctness. The value should be given as it would be correct in a link tag's href.`
        }`,
        e
      )
    shadowRoot.appendChild(link)
  }
}
