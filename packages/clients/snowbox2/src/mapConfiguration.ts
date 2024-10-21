import language from './language'

const eigengrau = '#16161d'
const dataportRed = '#7d212b'
const notQuiteWhite = '#f2f3f4'

const basemapId = '23420'
const basemapGreyId = '23421'
const sBahn = '23050'
const uBahn = '23053'
const WMS_SH_ALKIS_Fluren_Gemarkungen = '165'
const hamburgBorder = '6074'

/**
 * bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/src/defaults.js
 * implicitly using masterportalAPI HH defaults by fallback
 * they can be overwritten in this object
 */
export const mapConfiguration = {
  startResolution: 2.583190458,
  startCenter: [573379.7, 6028843.47],
  extent: [565531.1, 6024467.78, 581232.51, 6031947.73],
  language: 'en',
  epsg: 'EPSG:25832',
  locales: language,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: dataportRed,
          primaryContrast: notQuiteWhite,
          secondary: eigengrau,
          secondaryContrast: notQuiteWhite,
        },
      },
    },
  },
  namedProjections: [
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
    [
      'EPSG:4647',
      '+proj=tmerc +lat_0=0 +lon_0=9 +k=0.9996 +x_0=32500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
  ],
  addressSearch: {
    searchMethods: [
      {
        queryParameters: {
          searchAddress: true,
          searchStreets: true,
          searchHouseNumbers: true,
        },
        type: 'mpapi',
        url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
      },
    ],
    minLength: 3,
    waitMs: 300,
  },
  attributions: {
    initiallyOpen: false,
    windowWidth: 300,
    layerAttributions: [
      {
        id: basemapId,
        title: 'snowbox.attributions.basemap',
      },
      {
        id: basemapGreyId,
        title: 'snowbox.attributions.basemapGrey',
      },
      {
        id: uBahn,
        title: 'snowbox.attributions.underground',
      },
      {
        id: sBahn,
        title: 'snowbox.attributions.rapid',
      },
      /*
      {
        id: 6357,
        title:
          'Karte <a href="https://gdz.bkg.bund.de/index.php/default/wms-webatlasde-light-wms-webatlasde-light.html" target="_blank">WebAtlasDE.light</a>: © <a href="https://www.bkg.bund.de" target="_blank">BKG</a>',
      },
      */
      {
        id: WMS_SH_ALKIS_Fluren_Gemarkungen,
        title:
          'Karte <a href="https://service.gdi-sh.de/WMS_SH_ALKIS_Fluren_Gemarkungen?REQUEST=GetCapabilities" target="_blank">Fluren/Gemarkungen ALKIS</a>: © GeoBasis-DE/<a href="https://www.schleswig-holstein.de/DE/Landesregierung/LVERMGEOSH/lvermgeosh_node.html" target="_blank">LVermGeo SH</a>',
      },
    ],
  },
  draw: {
    selectableDrawModes: ['Circle', 'LineString', 'Point', 'Polygon', 'Text'],
    textStyle: {
      font: {
        size: [10, 20, 30],
        family: 'Arial',
      },
    },
    style: {
      fill: { color: 'rgba(255, 255, 255, 0.5)' },
      stroke: {
        color: '#e51313',
        width: 2,
      },
      circle: {
        radius: 7,
        fillColor: '#e51313',
      },
    },
  },
  export: {
    showPng: true,
    showJpg: false,
    showPdf: false,
  },
  geoLocation: {
    checkLocationInitially: false,
    zoomLevel: 9,
  },
  gfi: {
    layers: {
      [uBahn]: {
        geometry: true,
        window: true,
        properties: {
          status: 'Status',
          art: 'Art',
        },
      },
      [sBahn]: {
        geometry: true,
        window: true,
        properties: {
          status: 'Status',
          art: 'Art',
        },
      },
    },
    coordinateSources: [
      'plugin/pins/transformedCoordinate',
      'plugin/pins/coordinatesAfterDrag',
    ],
    customHighlightStyle: {
      stroke: {
        color: dataportRed,
        width: 10,
      },
      fill: {
        color: 'rgb(255, 255, 255, 0.5)', // Tranzparenz 50 %
      },
    },
  },
  layers: [
    {
      id: basemapId,
      visibility: true,
      type: 'background',
      name: 'snowbox.layers.basemap',
    },
    {
      id: basemapGreyId,
      type: 'background',
      name: 'snowbox.layers.basemapGrey',
    },
    {
      id: uBahn,
      visibility: true,
      type: 'mask',
      name: 'snowbox.layers.underground',
    },
    {
      id: sBahn,
      type: 'mask',
      name: 'snowbox.layers.rapid',
    },
    {
      id: hamburgBorder,
      visibility: true,
      hideInMenu: true,
      type: 'mask',
      name: 'snowbox.layers.hamburgBorder',
    },
    /*
    {
      id: 6357,
      visibility: false,
      type: 'background',
      name: 'WebAtlasDE (Light)',
    },
    */
    {
      id: WMS_SH_ALKIS_Fluren_Gemarkungen,
      visibility: false,
      type: 'mask',
      hideInMenu: false,
      name: 'Fluren und Gemarkungen',
    },
  ],
  pins: {
    boundaryLayerId: hamburgBorder,
    toZoomLevel: 9,
    movable: 'drag',
    appearOnClick: {
      show: true,
      atZoomLevel: 6,
    },
    style: {
      fill: '#ff0019',
    },
  },
}
