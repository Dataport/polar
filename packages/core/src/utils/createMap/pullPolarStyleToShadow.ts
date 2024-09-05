const defaultStylePath = './style.css'

export const pullPolarStyleToShadow = (
  shadowRoot: ShadowRoot,
  stylePath = defaultStylePath
) => {
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
