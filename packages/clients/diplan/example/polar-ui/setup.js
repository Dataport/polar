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
 * in `createMap` */
export default (client, layerConf, config) => {
  client
    .createMap({
      // id of div to render in
      containerId: 'polarstern',
      /* see API.md for mapConfiguration options, especially the compiled
       * version at https://dataport.github.io/polar/docs/diplan/client-diplan.html  */
      mapConfiguration: {
        stylePath: '../../dist/polar-client.css',
        layerConf, // either a Service[] or a link to a fitting json file
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

      const actionPlus = document.getElementById('action-plus')
      const actionMinus = document.getElementById('action-minus')
      const actionToast = document.getElementById('action-toast')
      const actionLoadGeoJson = document.getElementById('action-load-geojson')
      const actionZoomToAll = document.getElementById('action-zoom-to-all')
      const actionScreenshot = document.getElementById('action-screenshot')
      const actionFillAddressSearch = document.getElementById(
        'action-address-search-filler'
      )
      const actionLasso = document.getElementById('action-lasso')
      const actionNone = document.getElementById('action-none')
      const actionCut = document.getElementById('action-cut-polygons')
      const actionDuplicate = document.getElementById(
        'action-duplicate-geometry'
      )
      const actionMerge = document.getElementById('action-merge-polygons')
      const activeExtendedDrawMode = document.getElementById('active-draw-mode')

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
      actionScreenshot.onclick = () =>
        mapInstance.$store.dispatch('plugin/export/exportAs', 'Png')
      actionFillAddressSearch.addEventListener('input', (e) =>
        mapInstance.$store.dispatch('plugin/addressSearch/search', {
          input: e.target.value,
          autoselect: 'first',
        })
      )
      actionLasso.onclick = () =>
        mapInstance.$store.dispatch('plugin/draw/setMode', 'lasso')
      actionCut.onclick = () =>
        mapInstance.$store.dispatch('diplan/cutPolygons')
      actionDuplicate.onclick = () =>
        mapInstance.$store.dispatch('diplan/duplicatePolygons')
      actionMerge.onclick = () =>
        mapInstance.$store.dispatch('diplan/mergePolygons')
      actionNone.onclick = () =>
        mapInstance.$store.dispatch('diplan/updateDrawMode', null)
      mapInstance.$store.watch(
        (_, getters) => getters['diplan/activeDrawMode'],
        (activeDrawMode) => (activeExtendedDrawMode.innerHTML = activeDrawMode),
        { immediate: true }
      )

      const htmlRevisedDrawExport = document.getElementById(
        'subscribed-revised-draw-export'
      )
      const htmlRevisionInProgress = document.getElementById(
        'subscribed-revision-in-progress'
      )
      const htmlSimpleGeometryValidity = document.getElementById(
        'subscribed-simple-geometry-validity'
      )
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
      mapInstance.subscribe('diplan/revisedDrawExport', (revisedDrawExport) => {
        htmlRevisedDrawExport.innerHTML = JSON.stringify(
          revisedDrawExport,
          null,
          2
        )
      })
      mapInstance.subscribe(
        'diplan/revisionInProgress',
        (revisionInProgress) => {
          htmlRevisionInProgress.innerHTML = revisionInProgress
        }
      )
      mapInstance.subscribe(
        'diplan/simpleGeometryValidity',
        (simpleGeometryValidity) => {
          htmlSimpleGeometryValidity.innerHTML = simpleGeometryValidity
        }
      )

      window.mapInstance = mapInstance
    })
}
