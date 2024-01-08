/**
 * Adds a `simulateRecreate` method to the window object that is supposed to
 * imitate what happens on re-navigation in a SPA. This will only work in
 * production mode, and it won't work with the old-style CSS imports, requiring
 * use of the new core field `stylePath`. (It is automatically `./style.css` in
 * case no old-style `data-polar="true"` is present.)
 * @param {function} setup setup function that results in map creation
 * @param {Vue} mapInstance vue instance
 */
export const makeSimulateRecreate = (setup, mapInstance) => {
  window.simulateRecreate = () => {
    /* destroy vue instance; this will not remove the rendered HTML, but unlink
     * all internal creations and effects. This should be called before re-
     * navigating, usual lifecycle hooks are `beforeDestroy` or `beforeUnmount`,
     * depending on the framework in use */
    mapInstance.$destroy()

    /* when re-navigating, the DOM's body is reset – here it is simulated by
     * resetting the DOM manually, but usually the SPA should take care of this
     * automatically due to the occurring renavigation. */
    const polarstern = document.getElementById('polarstern-wrapper')
    const risingStar = document.createElement('div')
    risingStar.id = 'polarstern'
    risingStar.classList.add('polarstern')
    polarstern?.parentElement?.replaceChild(risingStar, polarstern)

    // render client – a second/third/... time, here
    setup()
  }

  // eslint-disable-next-line no-console
  console.info(
    'This is a test environment. Run `simulateRecreate()` to test how the client behaves on another createMap call on a reset HTML body.'
  )
}
