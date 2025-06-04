/**
 * Since device dpi are not directly available, this common hack is applied to get the actual device dpi.
 * If dpi can not be inferred, 96 is returned as default value, and a warning is logged.
 * @returns The device dpi
 */
function getDpi(): number {
  let dpi = 96

  try {
    const dpiDiv = document.createElement('div')
    const body = document.body

    dpiDiv.id = 'programmatical-dpidiv'
    dpiDiv.setAttribute(
      'style',
      'position: absolute; height: 1in; width: 1in; top: -100%; left: -100%;'
    )
    body.appendChild(dpiDiv)

    dpi = dpiDiv.offsetWidth * (window.devicePixelRatio || 1)
    body.removeChild(dpiDiv)
  } catch (e) {
    console.error('@polar/plugin-scale', e)
    console.warn(
      `@polar/plugin-scale: Since the dpi could not be inferred, the default value ${dpi} will be used.`
    )
  }

  return dpi
}

export default getDpi
