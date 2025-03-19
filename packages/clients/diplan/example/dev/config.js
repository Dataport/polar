// service id map to avoid typos, ease renames
const basemap = 'basemapde_farbe'
const xplanwms = 'xplanwms'
const xplanwfs = 'xplanwfs'
const flurstuecke = 'flurstuecke'
const bstgasleitung = 'bst_gasleitung'

export default {
  startResolution: 264.583190458,
  startCenter: [561210, 5932600],
  extent: [
    248651.73157077, 5227198.20287631, 928366.12236557, 6118661.62507136,
  ],
  diplan: {
    mergeToMultiGeometries: true,
    validateGeoJson: true,
    metaServices: [
      {
        id: flurstuecke,
        propertyNames: ['land', 'gemarkung', 'regbezirk', 'kreis', 'gemeinde'],
        aggregationMode: 'unequal',
      },
    ],
  },
  locales: [
    {
      type: 'de',
      resources: {
        diplan: {
          layers: {
            [basemap]: 'BasemapDE',
            [xplanwms]: 'XPlanWMS',
            [xplanwfs]: 'XPlanSynWFS',
            [flurstuecke]: 'Flurstücke',
            [bstgasleitung]: 'BST Gasleitung',
          },
          attributions: {
            [basemap]: `$t(diplan.layers.${basemap}) © GeoBasis-DE / BKG <YEAR> CC BY 4.0`,
            [xplanwms]: `$t(diplan.layers.${xplanwms}) © ???`,
            [xplanwfs]: `$t(diplan.layers.${xplanwfs}) © ???`,
            [flurstuecke]: `$t(diplan.layers.${flurstuecke}) © ???`,
            [bstgasleitung]: `$t(diplan.layers.${bstgasleitung}) © ???`,
          },
        },
      },
    },
  ],
  addressSearch: {
    displayComponent: true,
    searchMethods: [
      {
        groupId: 'diplan',
        categoryId: 'wfsg',
        queryParameters: {
          searchAddress: true,
          searchStreets: true,
          searchHouseNumbers: true,
        },
        type: 'mpapi',
        url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
      },
      {
        groupId: 'diplan',
        categoryId: 'bkg',
        queryParameters: {
          filter: {
            bundesland: 'Hamburg',
          },
        },
        type: 'bkg',
        url: 'https://gisdemo.dp.dsecurecloud.de/bkg_geosearch3',
      },
    ],
    groupProperties: {
      diplan: {
        label: 'Suchbegriff',
        hint: 'Suchbegriff',
        resultDisplayMode: 'categorized',
        limitResults: 3,
      },
    },
    categoryProperties: {
      bkg: {
        label: 'BKG Ergebnisse',
      },
      wfsg: {
        label: 'Gazetteer Ergebnisse',
      },
    },
    minLength: 3,
    waitMs: 300,
  },
  layers: [
    {
      id: basemap,
      visibility: true,
      type: 'background',
      name: `diplan.layers.${basemap}`,
    },
    {
      id: xplanwms,
      visibility: true,
      type: 'mask',
      name: `diplan.layers.${xplanwms}`,
    },
    {
      id: xplanwfs,
      visibility: false,
      type: 'mask',
      name: `diplan.layers.${xplanwfs}`,
    },
    {
      id: flurstuecke,
      visibility: false,
      // TODO available from 7, but only starts loading from 8 - bug or skill issue? → POLAR-431
      minZoom: 7,
      type: 'mask',
      name: `diplan.layers.${flurstuecke}`,
    },
    {
      id: bstgasleitung,
      visibility: false,
      type: 'mask',
      name: `diplan.layers.${bstgasleitung}`,
    },
    {
      id: 'secureServiceTest',
      visibility: false,
      type: 'mask',
      name: 'Secure Service Test',
    },
  ],
  attributions: {
    layerAttributions: [
      {
        id: basemap,
        title: `diplan.attributions.${basemap}`,
      },
      {
        id: xplanwms,
        title: `diplan.attributions.${xplanwms}`,
      },
      {
        id: xplanwfs,
        title: `diplan.attributions.${xplanwfs}`,
      },
      {
        id: flurstuecke,
        title: `diplan.attributions.${flurstuecke}`,
      },
      {
        id: bstgasleitung,
        title: `diplan.attributions.${bstgasleitung}`,
      },
    ],
  },
  draw: {
    enableOptions: true,
    lassos: [
      {
        id: flurstuecke,
      },
      {
        id: xplanwfs,
      },
    ],
    measureOptions: {
      metres: true,
      kilometres: true,
      hectares: true,
    },
    selectableDrawModes: ['Point', 'LineString', 'Circle', 'Text', 'Polygon'],
    snapTo: [xplanwfs, flurstuecke],
    textStyle: {
      font: {
        size: [10, 20, 30],
        family: 'Arial',
      },
    },
    style: {
      fill: { color: 'rgb(51 117 212 / 50%)' },
      stroke: {
        color: '#3375d4',
        width: 2,
      },
      circle: {
        radius: 7,
        fillColor: 'rgb(51 117 212 / 50%)',
      },
    },
  },
  export: {
    displayComponent: true,
    showJpg: false,
    showPdf: false,
  },
  gfi: {
    mode: 'bboxDot',
    layers: {
      [xplanwms]: {
        geometry: true,
        window: true,
        properties: ['xpPlanName'],
      },
      [xplanwfs]: {
        geometry: true,
        window: true,
        properties: ['name'],
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
      atZoomLevel: 0,
    },
  },
}
