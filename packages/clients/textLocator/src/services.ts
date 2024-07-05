export const openStreetMap = 'openStreetMap'
export const openSeaMap = 'openSeaMap'
export const mdiSeaNames = 'mdiSeaNames'
export const wmtsTopplusOpenWeb = 'wmtsTopplusOpenWeb'
export const wmtsTopplusOpenWebGrey = 'wmtsTopplusOpenWebGrey'
export const wmtsTopplusOpenLight = 'wmtsTopplusOpenLight'
export const wmtsTopplusOpenLightGrey = 'wmtsTopplusOpenLightGrey'
export const aerial = 'aerial'

export const idRegister = [
  openSeaMap,
  mdiSeaNames,
  openStreetMap,
  wmtsTopplusOpenWeb,
  wmtsTopplusOpenWebGrey,
  wmtsTopplusOpenLight,
  wmtsTopplusOpenLightGrey,
  aerial,
]

const topplusLayerNames = {
  [wmtsTopplusOpenWeb]: 'web',
  [wmtsTopplusOpenWebGrey]: 'web_grau',
  [wmtsTopplusOpenLight]: 'web_light',
  [wmtsTopplusOpenLightGrey]: 'web_light_grau',
}

export const services = [
  ...[
    wmtsTopplusOpenLight,
    wmtsTopplusOpenLightGrey,
    wmtsTopplusOpenWeb,
    wmtsTopplusOpenWebGrey,
  ].map((id) => ({
    id,
    capabilitiesUrl:
      'https://sgx.geodatenzentrum.de/wmts_topplus_open/1.0.0/WMTSCapabilities.xml',
    urls: 'https://sgx.geodatenzentrum.de/wmts_topplus_open',
    optionsFromCapabilities: true,
    tileMatrixSet: 'EU_EPSG_25832_TOPPLUS',
    typ: 'WMTS',
    layers: topplusLayerNames[id],
    legendURL: `https://sg.geodatenzentrum.de/wms_topplus_open?styles=&layer=${topplusLayerNames[id]}&service=WMS&format=image/png&sld_version=1.1.0&request=GetLegendGraphic&version=1.1.1`,
  })),
  {
    id: openStreetMap,
    urls: [
      'https://a.tile.openstreetmap.org/{TileMatrix}/{TileCol}/{TileRow}.png',
      'https://b.tile.openstreetmap.org/{TileMatrix}/{TileCol}/{TileRow}.png',
      'https://c.tile.openstreetmap.org/{TileMatrix}/{TileCol}/{TileRow}.png',
    ],
    typ: 'WMTS',
    format: 'image/png',
    coordinateSystem: 'EPSG:3857',
    origin: [-20037508.3428, 20037508.3428],
    transparent: false,
    tileSize: '256',
    minScale: '1',
    maxScale: '2500000',
    tileMatrixSet: 'google3857',
    requestEncoding: 'REST',
    resLength: '20',
  },
  {
    id: openSeaMap,
    urls: [
      'https://tiles.openseamap.org/seamark/{TileMatrix}/{TileCol}/{TileRow}.png',
    ],
    typ: 'WMTS',
    format: 'image/png',
    coordinateSystem: 'EPSG:3857',
    origin: [-20037508.3428, 20037508.3428],
    transparent: true,
    tileSize: '256',
    minScale: '1',
    maxScale: '2500000',
    tileMatrixSet: 'google3857',
    requestEncoding: 'REST',
    resLength: '20',
  },
  {
    id: mdiSeaNames,
    url: `https://mdi-de-dienste.org/geoserver_gaz/nokis/ows`,
    typ: 'WMS',
    layers: 'name_service',
    legendURL: 'ignore',
    format: 'image/png',
    version: '1.3.0',
    transparent: true,
    singleTile: true,
    STYLES: 'Seeseitig',
  },
  {
    id: aerial,
    url: 'https://sgx.geodatenzentrum.de/wms_sen2europe',
    typ: 'WMS',
    layers: 'rgb',
    legendURL: 'ignore',
    format: 'image/png',
    version: '1.3.0',
    transparent: true,
    singleTile: true,
  },
]
