import language from './language'

const eigengrau = '#16161d'
const somewhatBlue = '#002177'
const notQuiteWhite = '#f2f3f4'

const basemapId = '23420'
const basemapGreyId = '23421'
const sBahn = '23050'
const uBahn = '23053'

const hamburgBorder = '6074'

/**
 * bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/src/defaults.js
 * implicitly using masterportalAPI HH defaults by fallback
 * they can be overwritten in this object
 */
export const mapConfiguration = {
  language: 'en',
  epsg: 'EPSG:25832',
  locales: language,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: somewhatBlue,
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
        title: 'snowbox.layers.underground',
      },
      {
        id: sBahn,
        title: 'snowbox.layers.rapid',
      },
    ],
  },
  draw: {
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
        color: '#FFFF00',
        width: 3,
      },
      fill: {
        color: 'rgb(255, 255, 255, 0)',
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
  ],
  pins: {
    boundaryLayerId: hamburgBorder,
    toZoomLevel: 9,
    movable: true,
    appearOnClick: {
      show: true,
      atZoomLevel: 0,
    },
    style: {
      fill: '#ff0019',
    },
  },
}
