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

let zoomLevel = 0

const mapConfiguration = {
  stylePath: '../dist/polar-client.css',
  options: [
    { resolution: 52.9166380916821, scale: 200000, zoomLevel: zoomLevel++ },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: zoomLevel++ },
    { resolution: 19.84373928438079, scale: 75000, zoomLevel: zoomLevel++ },
  ],
  layers: [
    {
      id: '453',
      visibility: true,
      type: 'background',
      name: 'Stadtplan Hamburg',
    },
  ],
  attributions: {
    layerAttributions: [
      {
        id: '453',
        title: 'Copyrightinformationen zum Stadtplan Hamburg',
      },
    ],
  },
}

// you may as well use a local array
const servicesUrl = 'https://geodienste.hamburg.de/services-internet.json'

client.rawLayerList.initializeLayerList(servicesUrl, (layerConf) =>
  client
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration,
        layerConf,
      },
    })
    .then((mapInstance) => {
      window.mapInstance = mapInstance

      const inputFillColor = document.getElementById('input-fill-color')
      const inputStrokeColor = document.getElementById('input-stroke-color')
      const inputStrokeWidth = document.getElementById('input-stroke-width')

      const overrideStyle = () => {
        mapInstance.setStyle({
          fill: {
            color: inputFillColor.value,
          },
          stroke: {
            color: inputStrokeColor.value,
            width: Number(inputStrokeWidth.value),
          },
        })
      }

      inputFillColor.addEventListener('input', overrideStyle)
      inputStrokeColor.addEventListener('input', overrideStyle)
      inputStrokeWidth.addEventListener('input', overrideStyle)
    })
)

// Export für Import-Syntax
if (typeof module !== 'undefined') {
  module.exports = client
}
