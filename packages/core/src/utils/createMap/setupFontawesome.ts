// @ts-expect-error | TS can't find the type definitions. This is fine, as this is css.
import fontawesomeFree from '@fortawesome/fontawesome-free/css/all.css?inline'

const outerNodeId = 'polar-fontawesome-outer-node'

export const setupFontawesome = (
  shadowRoot: ShadowRoot,
  renderFaToLightDom = true
) => {
  const styleNode = document.createElement('style')
  styleNode.innerHTML = fontawesomeFree
  shadowRoot.appendChild(styleNode)

  /*
   * - https://stackoverflow.com/questions/62129243/external-font-does-not-load-when-link-is-loaded-from-inside-the-shadowdom
   * - https://bugs.chromium.org/p/chromium/issues/detail?id=336876
   *
   * Due to an unfixed bug in chromium and other browsers, FontAwesome is also
   * required in the Light/Root DOM outside our ShadowDOM.
   */
  if (!document.getElementById(outerNodeId) && renderFaToLightDom) {
    const outerNode = document.createElement('style')
    outerNode.id = outerNodeId
    outerNode.innerHTML = fontawesomeFree
    document.head.appendChild(outerNode)
  }
}
