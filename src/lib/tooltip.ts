import i18next, { type TOptions } from 'i18next'

/**
 * The first entry is an HTML element tag, and the second entry is a locale key
 * used as (translated) child of that tag. May also include values that are
 * not locale keys. Translation will be tried on anything that's given. If a
 * third object is present, it's assumed to be translation options.
 */
export type TooltipLocaleKeys = [string, string, TOptions?][]

export interface GetTooltipParams {
	/** Wrapper elements and locale keys to use in the tooltip. */
	localeKeys: TooltipLocaleKeys
	/** Inline style string. If none used, default styling is applied. */
	style?: string
}

export interface Tooltip {
	/** Tooltip as a div, bound to inputs. */
	element: HTMLDivElement
	/** Unregisters i18next listeners so garbage collection may pick tooltip up when you no longer need it. Usage only required on dynamic div creation. */
	unregister: () => void
}

const setInnerHtml =
	(tooltip: HTMLDivElement, localeKeys: TooltipLocaleKeys) => () =>
		(tooltip.innerHTML = localeKeys
			.map(
				([element, localeKey, options]) =>
					`<${element}>${i18next.t(localeKey, options)}</${element}>`
			)
			.join(''))

const defaultStyle = `
	background: rgba(255, 255, 255, 0.8);
	padding: 0.2em 0.5em;
	border-radius: 4px;
	color: #16161d;
	box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.5);
`

/*
 * Minimal package that provides a `div` element factory bound to `i18next`
 * translations. The element is supposed to be used in `ol/Overlay`, but may be
 * used in any context.
 *
 * Usage example:
 *
 * ```js
 * import { getTooltip } from '@polar/lib-tooltip'
 *
 * // 'unregister' to drop locale listener after usage of 'element' (div) ends
 * const {element, unregister} = getTooltip({
 *  // optional inline style string; undefined for default, '' for none
 * 	style: '',
 * 	localeKeys: [
 * 		// tag/content pairs
 * 		['h2', 'plugins.myPlugin.header'],
 * 		['p', 'plugins.myPlugin.body']
 * 	],
 * })
 * ```
 */
export const getTooltip = ({
	style = defaultStyle,
	localeKeys,
}: GetTooltipParams): Tooltip => {
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
