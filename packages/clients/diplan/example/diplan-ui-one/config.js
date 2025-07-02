// service id map to avoid typos, ease renames
const basemap = 'basemapde_farbe'
const stadtplan = '453'
const luftbilder = '34127'

const xplanwms = 'xplanwms'
const xplanwfs = 'xplanwfs'

const flurstuecke = 'flurstuecke'
const bstgasleitung = 'bst_gasleitung'
const bauDenkmaeler = 'bauDenkmaeler'
const bebauungsPlaene = 'bebauungsplaene'

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
  },
  // general POLAR parameters
  locales: [
    {
      type: 'de',
      resources: {
        diplan: {
          layers: {
            [basemap]: 'BasemapDE',
            [stadtplan]: 'Stadtplan',
            [luftbilder]: 'Luftbilder',
            [xplanwms]: 'XPlanWMS',
            [xplanwfs]: 'XPlanSynWFS',
            [flurstuecke]: 'Flurstücke',
            [bstgasleitung]: 'BST Gasleitung',
            [bauDenkmaeler]: 'Denkmalkartierung Baudenkmale',
            [bebauungsPlaene]: 'Bebauungspläne',
          },
          attributions: {
            [basemap]: `$t(diplan.layers.${basemap}) © GeoBasis-DE / BKG <YEAR> CC BY 4.0`,
            [stadtplan]: `$t(diplan.layers.${stadtplan}): <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>`,
            [luftbilder]: `$t(diplan.layers.${luftbilder}): <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>`,
            [xplanwms]: `$t(diplan.layers.${xplanwms}) © ???`,
            [xplanwfs]: `$t(diplan.layers.${xplanwfs}) © ???`,
            [flurstuecke]: `$t(diplan.layers.${flurstuecke}) © ???`,
            [bstgasleitung]: `$t(diplan.layers.${bstgasleitung}) © ???`,
            [bauDenkmaeler]: `$t(diplan.layers.${bauDenkmaeler}): <a target="_blank" href="https://www.hamburg.de/bsw/landesbetrieb-geoinformation-und-vermessung/">Landesbetrieb Geoinformation und Vermessung</a>`,
            [bebauungsPlaene]: `$t(diplan.layers.${bebauungsPlaene}): <a target="_blank" href="https://www.hamburg.de/politik-und-verwaltung/behoerden/behoerde-fuer-stadtentwicklung-und-wohnen">Behörde für Stadtentwicklung und Wohnen</a>`,
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
      id: stadtplan,
      type: 'background',
      name: `diplan.layers.${stadtplan}`,
    },
    {
      id: luftbilder,
      type: 'background',
      name: `diplan.layers.${luftbilder}`,
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
      id: bauDenkmaeler,
      visibility: false,
      type: 'mask',
      name: `diplan.layers.${bauDenkmaeler}`,
    },
    {
      id: bebauungsPlaene,
      visibility: false,
      type: 'mask',
      name: `diplan.layers.${bebauungsPlaene}`,
      options: {
        layers: {
          order: 'hh_hh_festgestellt,hh_lgv_imverfahren',
          legend: true,
          title: {
            hh_hh_festgestellt: 'Festgestellte Bebauungspläne',
            hh_lgv_imverfahren: 'Bebauungspläne im Verfahren',
          },
        },
      },
    },
  ],
  attributions: {
    layerAttributions: [
      {
        id: basemap,
        title: `diplan.attributions.${basemap}`,
      },
      {
        id: stadtplan,
        title: `diplan.attributions.${stadtplan}`,
      },
      {
        id: luftbilder,
        title: `diplan.attributions.${luftbilder}`,
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
      {
        id: bauDenkmaeler,
        title: `diplan.attributions.${bauDenkmaeler}`,
      },
      {
        id: bebauungsPlaene,
        title: `diplan.attributions.${bebauungsPlaene}`,
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
    revision: {
      autofix: true,
      mergeToMultiGeometries: true,
      metaServices: [
        {
          id: flurstuecke,
          propertyNames: [
            'land',
            'gemarkung',
            'regbezirk',
            'kreis',
            'gemeinde',
          ],
          aggregationMode: 'unequal',
        },
      ],
      validate: true,
    },
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
