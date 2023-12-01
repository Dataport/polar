import i18next from 'i18next'

export type TooltipLocaleKeys = [string, string][]

export interface GetTooltipParams {
  /** Inline style string. If none used, default styling is applied. */
  style?: string
  /**
   * Locale keys to use in the tooltip. In the format [string, string][], the
   * first entry is a HTML element tag, and the second entry is a locale key
   * used as (translated) child of that tag. May also include values that are
   * not locale keys. Translation will be tried on anything.
   */
  localeKeys: TooltipLocaleKeys
}

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

export const getTooltip = ({
  style = defaultStyle,
  localeKeys,
}: GetTooltipParams): Tooltip => {
  const element = document.createElement('div') as HTMLDivElement
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
