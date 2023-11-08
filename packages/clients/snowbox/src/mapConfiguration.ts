const eigengrau = '#16161d'
const somewhatBlue = '#002177'
const notQuiteWhite = '#f2f3f4'

const basemapId = '23420'
const basemapGreyId = '23421'
const sBahn = '23050'
const uBahn = '23053'

/**
 * bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/src/defaults.js
 * implicitly using masterportalAPI HH defaults by fallback
 * they could be overwritten in this object
 */
export const mapConfiguration = {
  language: 'de',
  epsg: 'EPSG:25832',
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
          memberSuffix: 'member',
          namespaces: [
            'http://www.adv-online.de/namespaces/adv/dog',
            'http://geodienste.hamburg.de/dog_gages/services/wfs_dog?SERVICE=WFS&VERSION=2.0.0&REQUEST=DescribeFeatureType&OUTPUTFORMAT=application/gml+xml;+version=3.2&TYPENAME=dog:Flurstueckskoordinaten&NAMESPACES=xmlns(dog,http://www.adv-online.de/namespaces/adv/dog)',
          ],
          fieldName: ['strassenname', 'hausnummer'],
          storedQueryId: 'AdresseOhneZusatz',
        },
        type: 'gazetteer',
        url: 'https:///geodienste.hamburg.de/HH_WFS_DOG',
      },
    ],
    minLength: 3,
    waitMs: 300,
  },
  attributions: {
    initiallyOpen: false,
    layerAttributions: [
      {
        id: basemapId,
        title: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
      },
      {
        id: basemapGreyId,
        title: 'Basemap Grau © basemap.de / BKG <MONTH> <YEAR>',
      },
      {
        id: uBahn,
        title:
          'Strecken U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
      },
      {
        id: sBahn,
        title:
          'Strecken S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
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
      name: 'Basemap.de Web Raster Farbe',
    },
    {
      id: basemapGreyId,
      type: 'background',
      name: 'Basemap.de Web Raster Grau',
    },
    {
      id: uBahn,
      visibility: true,
      type: 'mask',
      name: 'Einzugsbereich U-Bahn',
    },
    {
      id: sBahn,
      type: 'mask',
      name: 'Einzugsbereich S-Bahn',
    },
  ],
  pins: {
    toZoomLevel: 9,
    movable: true,
    appearOnClick: {
      show: true,
      atZoomLevel: 0,
    },
  },
}
