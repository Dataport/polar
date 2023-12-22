const defaultStylePath = './style.css'

export const pullPolarStyleToShadow = (
  shadowRoot: ShadowRoot,
  stylePath = defaultStylePath
) => {
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
    polarStylesheets.forEach((style) => shadowRoot.appendChild(style))

    if (!devMode) {
      console.warn(
        `Stylesheets have been pulled to the ShadowDOM. This mechanism is deprecated and will be removed in the next major version. In the future, POLAR will try to create the relevant style nodes itself, and can be configured as to where the file to be imported is located. This removes the flash of misstyled content POLAR could previously produce on the outlying page, and is an overall more clean solution. See the @polar/core documentation, field 'stylePath'.`
      )
    }
  } else {
    const link = document.createElement('link')
    link.href = stylePath
    link.rel = 'stylesheet'
    link.onerror = (e) =>
      console.error(
        `core.createMap: Couldn't find required stylesheets, map won't render. ${
          stylePath === defaultStylePath
            ? `The default stylePath ${defaultStylePath} did not work. Please check @polar/core's documentation of 'stylePath' on how this can be configured.`
            : `It seems the provided stylePath (${stylePath}) did not work. Please verify its correctness. The value should be given as it would be correct in a link tag's href.`
        }`,
        e
      )
    shadowRoot.appendChild(link)
  }
}
