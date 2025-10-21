import i18next from 'i18next'

type TooltipLocaleKeys = [string, string][]

export interface Tooltip {
	/** tooltip as a div, bound to inputs */
	element: HTMLDivElement

	/** unregisters i18next listeners so garbage collection may pick tooltip up when you no longer need it. usage only required on dynamic div creation. */
	unregister: () => void
}

const setInnerHtml =
	(tooltip: HTMLDivElement, localeKeys: TooltipLocaleKeys) => () =>
		(tooltip.innerHTML = localeKeys
			.map(
				([element, localeKey]) =>
					// @ts-expect-error | Locale keys are dynamic.
					`<${element}>${i18next.t(localeKey)}</${element}>`
			)
			.join(''))

const defaultStyle = `
	background: rgba(255, 255, 255, 0.8);
	padding: 0.2em 0.5em;
	border-radius: 4px;
	color: #16161d;
	box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.5);
`

/**
 * This function is basically a `div` element factory bound to `i18next`
 * translations. The element is supposed to be used in `ol/Overlay`, but may be
 * used in any context. The typical use case is to add information when hovering
 * features in the map.
 *
 * @param localeKeys - Locale keys to use in the tooltip. In the format
 * [string, string][], the first entry is an HTML element tag, and the second
 * entry is a locale key used as (translated) child of that tag. May also
 * include values that are not locale keys. Translation will be tried on anything.
 * @param style - Inline style string. If none used, default styling is applied.
 *
 * @example
 * ```
 * import { getTooltip } from '@/lib/tooltip'
 *
 * // 'unregister' to drop locale listener after usage of 'element' (div) ends
 * const { element, unregister } = getTooltip(
 * 	[
 * 		// tag/content pairs
 * 		['h2', 'plugins.myPlugin.header'],
 * 		['p', 'plugins.myPlugin.body'],
 * 	],
 * 	// optional inline style string; undefined for default, '' for none
 * 	''
 * )
 * ```
 */
export function getTooltip(
	localeKeys: TooltipLocaleKeys,
	style = defaultStyle
): Tooltip {
	const element = document.createElement('div')
	element.style.cssText = style

	const translate = setInnerHtml(element, localeKeys)
	i18next.on('languageChanged', translate)
	i18next.store.on('added', translate)

	// initialize
	translate()

	return {
		element,
		unregister: () => {
			i18next.off('languageChanges', translate)
			i18next.store.off('added', translate)
		},
	}
}
