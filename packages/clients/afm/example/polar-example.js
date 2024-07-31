/* globals MapClient, module */

let client

if (typeof MapClient !== 'undefined') {
  client = MapClient
}

// Code nur für Dev-Umgebung
if (!client) {
  console.warn(
    `@polar/client-afm: MapClient not found in environment. This is fine in dev mode, but an error in prod mode.`
  )
  client = require('../src/polar-client.ts') // eslint-disable-line
}

const mapConfiguration = {
  stylePath: '../dist/polar-client.css',
  layers: [
    {
      id: '453',
      visibility: true,
      type: 'background',
      name: 'Stadtplan Hamburg',
    },
    {
      id: '1561',
      visibility: true,
      type: 'mask',
      name: 'Bebauungsplänen',
      minZoom: 2,
    },
  ],
  attributions: {
    layerAttributions: [
      {
        id: '453',
        title: 'Copyrightinformationen zum Stadtplan Hamburg',
      },
      {
        id: '1561',
        title: 'Copyrightinformationen zu Bebauungsplänen',
      },
    ],
  },
  addressSearch: {
    displayComponent: false,
  },
  export: {
    showPdf: false,
  },
  draw: {},
  gfi: {
    layers: {
      1561: {
        geometry: true,
        window: true,
        properties: {
          feststellungsdatum: 'Umbenannt',
        },
      },
    },
    coordinateSources: [
      'plugin/pins/transformedCoordinate',
      'plugin/pins/coordinatesAfterDrag',
    ],
  },
  pins: {
    toZoomLevel: 9,
    movable: 'drag',
    appearOnClick: {
      show: true,
      atZoomLevel: 3,
    },
  },
}

// you may as well use a local array
const servicesUrl = 'https://geodienste.hamburg.de/services-internet.json'

client.rawLayerList.initializeLayerList(servicesUrl, function (layerConf) {
  client
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration,
        layerConf,
      },
    })
    .then((map) => {
      const vuexTargetZoom = document.getElementById('vuex-target-zoom')
      const vuexTargetGfi = document.getElementById('vuex-target-gfi')
      const vuexTargetPinCoordinate = document.getElementById(
        'vuex-target-pin-coordinate'
      )

      map.subscribe(
        'plugin/zoom/zoomLevel',
        (zoomLevel) => (vuexTargetZoom.innerHTML = zoomLevel)
      )
      map.subscribe(
        'plugin/gfi/featureInformation',
        (v) => (vuexTargetGfi.innerHTML = JSON.stringify(v, null, 2))
      )
      map.subscribe(
        'plugin/pins/transformedCoordinate',
        (pinCoordinate) => (vuexTargetPinCoordinate.innerHTML = pinCoordinate)
      )
    })
})

// Export für Import-Syntax
if (typeof module !== 'undefined') {
  module.exports = client
}
