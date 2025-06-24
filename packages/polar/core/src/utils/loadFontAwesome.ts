// @ts-expect-error | This CSS package doesn't have any type declarations.
import fontawesomeFree from '@fortawesome/fontawesome-free/css/all.min.css?inline'

export function loadFontAwesome() {
	/*
	 * - https://stackoverflow.com/questions/62129243/external-font-does-not-load-when-link-is-loaded-from-inside-the-shadowdom
	 * - https://bugs.chromium.org/p/chromium/issues/detail?id=336876
	 *
	 * Due to an unfixed bug in chromium and other browsers, FontAwesome is also
	 * required in the Light/Root DOM outside our ShadowDOM.
	 */
	const sheet = new CSSStyleSheet()
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	sheet.replaceSync(fontawesomeFree)
	document.adoptedStyleSheets.push(sheet)
}
