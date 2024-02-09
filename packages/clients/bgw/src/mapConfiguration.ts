/* eslint-disable @typescript-eslint/naming-convention */
// import { all } from 'ol/loadingstrategy'
import { MapConfig } from '../../../types/custom'

/*
const proxyUrl =
  'https://geoportale.dp.dsecurecloud.de/badegewaesser/proxy.php?url='
  */

const mapConfig: MapConfig = {
  epsg: 'EPSG:25832',
  namedProjections: [
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
    ],
  ],
  // NW 483727.83, 5893919.27, 624666.92, 6006915.51
  extent: [106281, 5223179, 1021520, 6126916],
  startCenter: [552874, 6005140],
  startResolution: 260.591595229,
  // proxyUrl,
  // serviceUrl:
  // 'https://umweltdaten.schleswig-holstein.de/security-proxy/services/wfs_bgw',
  // searchUrl: 'https://efi2.schleswig-holstein.de/bg/suche/?bgsuche=',
  // buttonLink:
  // 'https://www.schleswig-holstein.de/DE/Fachinhalte/B/badegewaesser/DarstellungBadestelle.html#bgst=',
  // defaultLayerId: '15000',
  options: [
    { resolution: 260.591595229, scale: 1000000, zoomLevel: 0 },
    { resolution: 132.291595229, scale: 500000, zoomLevel: 1 },
    { resolution: 52.9166380916821, scale: 200000, zoomLevel: 2 },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: 3 },
    { resolution: 19.84373928438079, scale: 75000, zoomLevel: 4 },
    { resolution: 13.229159522920526, scale: 50000, zoomLevel: 5 },
    { resolution: 5.2916638091682096, scale: 20000, zoomLevel: 6 },
    { resolution: 3.9687478568761576, scale: 15000, zoomLevel: 7 },
    { resolution: 2.6458319045841048, scale: 10000, zoomLevel: 8 },
    { resolution: 1.3229159522920524, scale: 5000, zoomLevel: 9 },
    { resolution: 1.058332761833642, scale: 4000, zoomLevel: 10 },
    { resolution: 0.7937495713752315, scale: 3000, zoomLevel: 11 },
    { resolution: 0.529166380916821, scale: 2000, zoomLevel: 12 },
    { resolution: 0.2645831904584105, scale: 1000, zoomLevel: 13 },
    { resolution: 0.1322915952292052, scale: 500, zoomLevel: 14 },
  ],
  locales: [
    {
      type: 'de',
      resources: {
        plugins: {
          filter: {
            layerName: {
              14003: 'Badestellen',
            },
            category: {
              14003: {
                title: {
                  bgw_gwkategory: 'Gewässerkategorie',
                },
                bgw_gwkategory: {
                  'Küstengewässer ': 'Küstengewässer',
                  See: 'See',
                  Fließgewässer: 'Fließgewässer',
                  Übergangsgewässer: 'Übergangsgewässer',
                },
              },
            },
          },
        },
      },
    },
  ],
  layers: [
    { id: '9001', name: 'Basemap', type: 'background', visibility: true },
    { id: '9002', name: 'Basemap (Grau)', type: 'background' },
    { id: '9003', name: 'Luftbilder', type: 'background' },
    { id: '14000', name: 'Verwaltungsgrenzen', type: 'mask' },
    {
      id: '14003',
      visibility: true,
      name: 'Badestellen',
      type: 'mask',
      loadingStrategy: 'all', // TODO doesn't seem to work?
    },
    {
      id: '14001',
      visibility: true,
      name: 'Ausdehnung der Badestellen',
      type: 'mask',
      loadingStrategy: 'all', // TODO doesn't seem to work?
    },
    {
      id: '14004',
      visibility: true,
      name: 'Probenahmestellen',
      type: 'mask',
      loadingStrategy: 'all', // TODO doesn't seem to work?
    },
  ],
  attributions: {
    layerAttributions: [
      { id: '9001', title: 'Basemap © GeoBasis-DE / BKG <YEAR> CC BY 4.0' },
      {
        id: '9002',
        title: 'Basemap (Grau) © GeoBasis-DE / BKG <YEAR> CC BY 4.0',
      },
      {
        id: '9003',
        title: 'Luftbilder © GeoBasis-DE/LVermGeo SH/CC BY-SA 4.0',
      },
      {
        id: '14000',
        title: 'Verwaltungsgrenzen © GeoBasis-DE/LVermGeo SH/CC BY 4.0',
      },
      {
        id: '14001',
        title:
          'Ausdehnung der Badestellen © Ministerium für Soziales, Gesundheit, Jugend, Familie und Senioren des Landes Schleswig-Holstein',
      },
      {
        id: '14002',
        title:
          'Badestellen © Ministerium für Soziales, Gesundheit, Jugend, Familie und Senioren des Landes Schleswig-Holstein',
      },
      {
        id: '14003',
        title:
          'Probenahmestellen © Ministerium für Soziales, Gesundheit, Jugend, Familie und Senioren des Landes Schleswig-Holstein',
      },
    ],
  },
  addressSearch: {
    addLoading: 'plugin/loadingIndicator/addLoadingKey',
    removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
    minLength: 3,
    waitMs: 300,
    searchMethods: [
      {
        queryParameters: {
          filter: {
            bundesland: 'Schleswig-Holstein',
          },
        },
        type: 'bkg',
        url: 'https://gisdemo.dp.dsecurecloud.de/bkg_geosearch3',
      },
    ],
    // ?
    // customSearchMethods: { dish: search, autocomplete },
    // customSelectResult: { categoryDenkmalsucheAutocomplete: selectResult },
  },
  pins: {
    toZoomLevel: 7,
  },
  filter: {
    layers: {
      14003: {
        categories: [
          {
            selectAll: true,
            targetProperty: 'bgw_gwkategory',
            knownValues: [
              'Küstengewässer ',
              'See',
              'Fließgewässer',
              'Übergangsgewässer',
            ],
          },
        ],
      },
    },
  },
  extendedMasterportalapiMarkers: {
    layers: ['14003'],
    defaultStyle: {
      stroke: '#FFFFFF',
      fill: '#005CA9',
    },
    hoverStyle: {
      stroke: '#46688E',
      fill: '#8BA1B8',
    },
    selectionStyle: {
      stroke: '#FFFFFF',
      fill: '#E10019',
    },
    clusterClickZoom: true,
    dispatchOnMapSelect: ['plugin/iconMenu/openMenuById', 'gfi'],
  },
  gfi: {
    mode: 'bboxDot',
    activeLayerPath: 'plugin/layerChooser/activeMaskIds',
    featureList: {
      mode: 'visible',
      pageLength: 10,
      text: [
        (feature) => feature.get('bgw_name'),
        (feature) => feature.get('bgw_gwkategory'),
      ],
      bindWithCoreHoverSelect: true,
    },
    layers: {
      14003: {
        window: true,
        geometry: false,
        properties: {
          bgw_name: 'Name',
          fid: 'EU-IRD',
          ort: 'Gemeinde',
          bgw_kreis: 'Kreis',
          bgw_gwkategory: 'Gewässerkategorie',
          bgw_laenge: 'geographische Länge',
          bgw_breite: 'geographische Breite',
          bgw_laenge_bgw: 'Länge Uferlinie (m)',
          bgw_umfeld: 'Umfeld (Infrastruktur)',
        },
        showTooltip: (feature) =>
          feature.get('features').length > 1
            ? [
                ['h2', 'Mehrere Badestellen'],
                ['span', 'Klicken zum Zoomen'],
              ]
            : [
                ['h2', feature.get('features')[0].get('bgw_name')],
                ['span', feature.get('features')[0].get('bgw_gwkategory')],
              ],
      },
    },
  },
}

export default mapConfig
