// service id map to avoid typos, ease renames
const basemap = 'basemapde_farbe'
const xplanwms = 'xplanwms'
const xplanwfs = 'xplanwfs'
const flurstuecke = 'flurstuecke'
const bstgasleitung = 'bst_gasleitung'

export default {
  // masterportalAPI parameters
  startResolution: 264.583190458,
  startCenter: [561210, 5932600],
  extent: [
    248651.73157077, 5227198.20287631, 928366.12236557, 6118661.62507136,
  ],
  // diplan-specific configuration example (see API.md)
  diplan: {
    link: {
      href: '../diplan-ui-small',
      icon: '$vuetify.icons.fullscreen-exit',
      label: 'diplan.linkButton.label',
    },
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
  // general POLAR parameters
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
      defaultGroup: {
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
      type: 'xplan',
      name: `diplan.layers.${xplanwms}`,
      options: {
        layers: {
          order: 'BP_Planvektor,SO_Planvektor',
          legend: true,
          title: {
            BP_Planvektor: 'BP Planvektor',
            SO_Planvektor: 'SO Planvektor',
          },
        },
      },
    },
    {
      id: xplanwfs,
      visibility: false,
      type: 'xplan',
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
    lassos: [
      {
        id: flurstuecke,
      },
      {
        id: xplanwfs,
      },
    ],
    snapTo: [xplanwfs, flurstuecke],
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
}
