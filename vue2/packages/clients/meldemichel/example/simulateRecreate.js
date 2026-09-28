/**
 * Adds a `simulateRecreate` method to the window object that is supposed to
 * imitate what happens on re-navigation in a SPA. This will only work in
 * production mode, and it won't work with the old-style CSS imports, requiring
 * use of the new core field `stylePath`. (It is automatically `./style.css` in
 * case no old-style `data-polar="true"` is present.)
 * @param {function} setup setup function that results in map creation
 */
export const makeSimulateRecreate = async (setup) => {
  let { un } = await setup()
  const rerenderButton = document.getElementById('rerender')

  return () => {
    if (rerenderButton) rerenderButton.disabled = true
    /* All set up watchers/subscribes have to be deleted. */
    if (un) un()

    /* when re-navigating, the DOM's body is reset – here it is simulated by
     * resetting the DOM manually, but usually the SPA should take care of this
     * automatically due to the occurring renavigation. */
    const polarstern = document.getElementById('polarstern-wrapper')
    const risingStar = document.createElement('div')
    risingStar.id = 'polarstern'
    risingStar.classList.add('polarstern')
    polarstern?.replaceWith(risingStar)

    setTimeout(async () => {
      // render client – a second/third/... time, here
      ;({ un } = await setup())
      if (rerenderButton) rerenderButton.disabled = false
    }, 1000)
  }
}
