import i18next from 'i18next'

const setInnerHtml = (tooltip: HTMLDivElement) => () =>
  (tooltip.innerHTML = `<h2>${i18next.t(
    'plugins.geoLocation.markerText'
  )}</h2>`)

const style = `
  background: rgba(255, 255, 255, 0.8);
  padding: 0.2em 0.5em;
  border-radius: 4px;
  color: #16161d;
  box-shadow: 0px 0px 3px 2px rgba(0, 0, 0, 0.5);
`

export const getTooltip = () => {
  const tooltip = document.createElement('div')
  tooltip.style.cssText = style

  setInnerHtml(tooltip)()
  i18next.on('languageChanged', setInnerHtml(tooltip))
  i18next.store.on('added', setInnerHtml(tooltip))

  return tooltip
}
