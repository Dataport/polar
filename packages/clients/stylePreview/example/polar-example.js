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

const writeIn = (path, target, value) => {
  const [first, ...rest] = path
  if (!rest.length) {
    target[first] = value
    return
  }

  if (!target[first]) {
    target[first] = {}
  }

  writeIn(rest, target[first], value)
}

const parseDash = (input) => {
  try {
    const value = JSON.parse(input)
    return value.length ? value : ''
  } catch {
    return ''
  }
}

const overrideStyle = (mapInstance, styleInputs) => () => {
  const nextStyle = {}
  styleInputs.forEach((styleInput) => {
    const id = styleInput.id
    const value = id.endsWith('width')
      ? parseFloat(styleInput.value)
      : id.endsWith('lineDash') || id.endsWith('size')
      ? parseDash(styleInput.value)
      : styleInput.value
    if (value !== '') {
      const path = id.split('-').slice(1) // throw away 'style-' prefix
      writeIn(path, nextStyle, value)
    }
  })
  mapInstance.updateStyles(nextStyle)
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

      const styleInputs = document.querySelectorAll(`[id^=${'style-'}]`)

      const boundUpdate = overrideStyle(mapInstance, styleInputs)
      styleInputs.forEach((input) =>
        input.addEventListener('input', boundUpdate)
      )
      boundUpdate()
    })
)

// Export für Import-Syntax
if (typeof module !== 'undefined') {
  module.exports = client
}
