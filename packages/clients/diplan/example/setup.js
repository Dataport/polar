/* eslint-disable max-lines-per-function */

/* this is an example setup function displaying how POLAR is instantiated
 * you may do this in any other format as long as all required contents arrive
 * in `initializeLayerList` and `createMap` */
export default (client, layerConf, config) => {
  /* The parameter may be an URL; in that case, a second parameter is a callback
   * function that provides the `layerConf` object as first parameter.
   * The code for that would look like this:
   * client.rawLayerList.initializeLayerList("url", (layerConf) => {
   *   client.createMap({...})
   * })
   * However, we're working with a loaded object here, making the
   * masterportalapi's `initializeLayerList` synchronous:
   */
  client.rawLayerList.initializeLayerList(layerConf)

  // TODO can we encapsulate do the upper statement in the core? people
  //      don't really need to do that manually, do they?

  client
    .createMap({
      // id of div to render in
      containerId: 'polarstern',
      /* see API.md for mapConfiguration options, especially the compiled
       * version at https://dataport.github.io/polar/docs/diplan/client-diplan.html  */
      mapConfiguration: {
        stylePath: '../dist/polar-client.css',
        layerConf,
        ...config,
      },
    })
    .then((mapInstance) => {
      /*
       * This is a binding example for the various data POLAR makes accessible.
       * The example is not exhaustive and additional fields may be found in
       * the API.md and nested documents in the compiled docs:
       * https://dataport.github.io/polar/docs/diplan/client-diplan.html
       */

      // TODO expand example bindings

      const htmlZoom = document.getElementById('subscribed-zoom')
      const htmlGfi = document.getElementById('subscribed-gfi')

      mapInstance.subscribe(
        'plugin/zoom/zoomLevel',
        (zoomLevel) => (htmlZoom.innerHTML = zoomLevel)
      )
      mapInstance.subscribe(
        'plugin/gfi/featureInformation',
        (v) => (htmlGfi.innerHTML = JSON.stringify(v, null, 2))
      )

      window.mapInstance = mapInstance
    })
}
