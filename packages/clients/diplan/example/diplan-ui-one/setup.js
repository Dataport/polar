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

let unsubscriptions = []

/* this is an example setup function displaying how POLAR is instantiated
 * you may do this in any other format as long as all required contents arrive
 * in `createMap` */
export const setup = (client, layerConf, config) => {
  client
    .createMap(
      {
        // id of div to render in
        containerId: 'polarstern',
        /* see API.md for mapConfiguration options, especially the compiled
         * version at https://dataport.github.io/polar/docs/diplan/client-diplan.html  */
        mapConfiguration: {
          stylePath: '../../dist/polar-client.css',
          layerConf,
          ...config,
        },
      },
      'DIPLAN_ONE'
    )
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
      const actionFillAddressSearch = document.getElementById(
        'action-address-search-filler'
      )
      const actionLasso = document.getElementById('action-lasso')
      const actionCut = document.getElementById('action-cut-polygons')
      const actionDuplicate = document.getElementById(
        'action-duplicate-polygons'
      )
      const actionScreenshot = document.getElementById('action-screenshot')
      const actionMerge = document.getElementById('action-merge-polygons')
      const activeExtendedDrawMode = document.getElementById('active-draw-mode')

      actionScreenshot.onclick = () =>
        mapInstance.$store.dispatch('plugin/export/exportAs', 'Png')
      actionPlus.onclick = () =>
        mapInstance.$store.dispatch('plugin/zoom/increaseZoomLevel')
      unsubscriptions.push(() => actionPlus.removeAttribute('onclick'))
      actionMinus.onclick = () =>
        mapInstance.$store.dispatch('plugin/zoom/decreaseZoomLevel')
      unsubscriptions.push(() => actionMinus.removeAttribute('onclick'))
      actionToast.onclick = () =>
        mapInstance.$store.dispatch('plugin/toast/addToast', {
          type: 'success',
          text: 'Dies ist eine Beispielnachricht.',
          timeout: 3000,
        })
      unsubscriptions.push(() => actionToast.removeAttribute('onclick'))
      actionLoadGeoJson.onclick = () => {
        mapInstance.$store.dispatch('plugin/draw/addFeatures', {
          geoJSON,
        })
      }
      unsubscriptions.push(() => actionLoadGeoJson.removeAttribute('onclick'))
      actionZoomToAll.onclick = () =>
        mapInstance.$store.dispatch('plugin/draw/zoomToAllFeatures', {
          margin: 10, // defaults to 20
        })
      unsubscriptions.push(() => actionZoomToAll.removeAttribute('onclick'))
      const input = (e) =>
        mapInstance.$store.dispatch('plugin/addressSearch/search', {
          input: e.target.value,
          autoselect: 'first',
        })
      actionFillAddressSearch.addEventListener('input', input)
      unsubscriptions.push(() =>
        actionFillAddressSearch.removeEventListener('input', input)
      )
      actionLasso.onclick = () =>
        mapInstance.$store.dispatch('plugin/draw/setMode', 'lasso')
      unsubscriptions.push(() => actionLasso.removeAttribute('onclick'))
      actionCut.onclick = () =>
        mapInstance.$store.dispatch('diplan/cutPolygons')
      unsubscriptions.push(() => actionCut.removeAttribute('onclick'))
      actionDuplicate.onclick = () =>
        mapInstance.$store.dispatch('diplan/duplicatePolygons')
      unsubscriptions.push(() => actionDuplicate.removeAttribute('onclick'))
      actionMerge.onclick = () =>
        mapInstance.$store.dispatch('diplan/mergePolygons')
      unsubscriptions.push(() => actionMerge.removeAttribute('onclick'))
      unsubscriptions.push(
        mapInstance.$store.watch(
          (_, getters) => getters['diplan/activeDrawMode'],
          (activeDrawMode) =>
            (activeExtendedDrawMode.innerHTML = activeDrawMode),
          { immediate: true }
        )
      )

      const htmlRevisedDrawExport = document.getElementById(
        'subscribed-revised-draw-export'
      )
      const htmlExportA = document.getElementById('subscribed-export-a')
      const htmlExportImg = document.getElementById('subscribed-export-img')
      const htmlRevisionInProgress = document.getElementById(
        'subscribed-revision-in-progress'
      )
      const htmlSimpleGeometryValidity = document.getElementById(
        'subscribed-simple-geometry-validity'
      )
      const htmlZoom = document.getElementById('subscribed-zoom')
      const htmlGfi = document.getElementById('subscribed-gfi')
      const htmlDraw = document.getElementById('subscribed-draw')

      unsubscriptions.push(
        mapInstance.subscribe(
          'plugin/zoom/zoomLevel',
          (zoomLevel) => (htmlZoom.innerHTML = zoomLevel)
        )
      )
      unsubscriptions.push(
        mapInstance.subscribe(
          'plugin/gfi/featureInformation',
          (v) => (htmlGfi.innerHTML = JSON.stringify(v, null, 2))
        )
      )
      unsubscriptions.push(
        mapInstance.subscribe('plugin/draw/featureCollection', (geojson) => {
          htmlDraw.innerHTML = JSON.stringify(geojson, null, 2)
        })
      )
      unsubscriptions.push(
        mapInstance.subscribe(
          'diplan/revisedDrawExport',
          (revisedDrawExport) => {
            htmlRevisedDrawExport.innerHTML = JSON.stringify(
              revisedDrawExport,
              null,
              2
            )
          }
        )
      )
      unsubscriptions.push(
        mapInstance.subscribe(
          'diplan/revisionInProgress',
          (revisionInProgress) => {
            htmlRevisionInProgress.innerHTML = revisionInProgress
          }
        )
      )
      unsubscriptions.push(
        mapInstance.subscribe(
          'diplan/simpleGeometryValidity',
          (simpleGeometryValidity) => {
            htmlSimpleGeometryValidity.innerHTML = simpleGeometryValidity
          }
        )
      )
      unsubscriptions.push(
        mapInstance.subscribe('plugin/export/exportedMap', (img) => {
          htmlExportA.setAttribute('href', img)
          htmlExportImg.setAttribute('src', img)
        })
      )

      window.mapInstance = mapInstance
    })
}

export const setdown = () => {
  unsubscriptions.forEach((un) => un())
  unsubscriptions = []
}
