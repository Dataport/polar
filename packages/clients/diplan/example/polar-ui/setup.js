/* eslint-disable max-lines-per-function */

const geoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [553702.4519707427, 5926504.665153537],
            [549799.849911481, 5938873.929307467],
            [582674.3113259386, 5942313.510783426],
            [572421.7126956752, 5930142.68402234],
            [553702.4519707427, 5926504.665153537],
          ],
        ],
      },
    },
  ],
}

/* this is an example setup function displaying how POLAR is instantiated
 * you may do this in any other format as long as all required contents arrive
 * in `initializeLayerList` and `createMap` */
export default (client, layerConf, config) => {
  /* The parameter may be a URL; in that case, a second parameter is a callback
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
        stylePath: '../../dist/polar-client.css',
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

      const actionPlus = document.getElementById('action-plus')
      const actionMinus = document.getElementById('action-minus')
      const actionToast = document.getElementById('action-toast')
      const actionLoadGeoJson = document.getElementById('action-load-geojson')
      const actionZoomToAll = document.getElementById('action-zoom-to-all')
      const actionFillAddressSearch = document.getElementById(
        'action-address-search-filler'
      )
      const actionLasso = document.getElementById('action-lasso')

      actionPlus.onclick = () =>
        mapInstance.$store.dispatch('plugin/zoom/increaseZoomLevel')
      actionMinus.onclick = () =>
        mapInstance.$store.dispatch('plugin/zoom/decreaseZoomLevel')
      actionToast.onclick = () =>
        mapInstance.$store.dispatch('plugin/toast/addToast', {
          type: 'success',
          text: 'Dies ist eine Beispielnachricht.',
          timeout: 3000,
        })
      actionLoadGeoJson.onclick = () => {
        mapInstance.$store.dispatch('plugin/draw/addFeatures', {
          geoJSON,
        })
      }
      actionZoomToAll.onclick = () =>
        mapInstance.$store.dispatch('plugin/draw/zoomToAllFeatures', {
          margin: 10, // defaults to 20
        })
      actionFillAddressSearch.addEventListener('input', (e) =>
        mapInstance.$store.dispatch('plugin/addressSearch/search', {
          input: e.target.value,
          autoselect: 'first',
        })
      )
      actionLasso.onclick = () =>
        mapInstance.$store.dispatch('plugin/draw/setMode', 'lasso')

      const htmlZoom = document.getElementById('subscribed-zoom')
      const htmlGfi = document.getElementById('subscribed-gfi')
      const htmlExportA = document.getElementById('subscribed-export-a')
      const htmlExportImg = document.getElementById('subscribed-export-img')
      const htmlDraw = document.getElementById('subscribed-draw')

      mapInstance.subscribe(
        'plugin/zoom/zoomLevel',
        (zoomLevel) => (htmlZoom.innerHTML = zoomLevel)
      )
      mapInstance.subscribe(
        'plugin/gfi/featureInformation',
        (v) => (htmlGfi.innerHTML = JSON.stringify(v, null, 2))
      )
      mapInstance.subscribe('plugin/export/exportedMap', (screenshot) => {
        htmlExportImg.setAttribute('src', screenshot)
        if (navigator.userAgent.toLowerCase().includes('firefox')) {
          htmlExportImg.onclick = function () {
            window.open(this.src, '_blank')
          }
          htmlExportA.onclick = () => false
        } else {
          htmlExportA.setAttribute('href', screenshot)
        }
      })
      mapInstance.subscribe('plugin/draw/featureCollection', (geojson) => {
        htmlDraw.innerHTML = JSON.stringify(geojson, null, 2)
      })

      window.mapInstance = mapInstance
    })
}
