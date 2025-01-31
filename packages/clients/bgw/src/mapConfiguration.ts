/* eslint-disable @typescript-eslint/naming-convention */
import { BKGParameters } from '@polar/plugin-address-search/src/types'

const mapConfig = {
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
  extent: [106281, 5223179, 1021520, 6126916],
  startCenter: [552874, 6005140],
  startResolution: 260.591595229,
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
      id: '14001',
      styleId: 'ausdehnungBadestellen',
      visibility: true,
      name: 'Ausdehnung der Badestellen',
      type: 'mask',
    },
    {
      id: '14003',
      styleId: 'badestellen',
      visibility: true,
      name: 'Badestellen',
      type: 'mask',
    },
    {
      id: '14004',
      styleId: 'probenahmestellen',
      visibility: true,
      name: 'Probenahmestellen',
      type: 'mask',
      minZoom: 1,
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
    minLength: 3,
    waitMs: 300,
    searchMethods: [
      {
        groupId: 'addressSearch',
        queryParameters: {
          filter: {
            bundesland: 'Schleswig-Holstein',
          },
        } as BKGParameters,
        type: 'bkg',
        url: 'https://gisdemo.dp.dsecurecloud.de/bkg_geosearch3',
      },
      {
        groupId: 'badestellenSearch',
        categoryId: 'badestellen',
        type: 'wfs',
        url: 'https://umweltgeodienste.schleswig-holstein.de/WFS_BGW',
        queryParameters: {
          srsName: 'EPSG:25832',
          typeName: 'badestellen',
          fieldName: 'bgw_name',
          featurePrefix: 'app',
          xmlns: 'http://www.deegree.org/app',
          useRightHandWildcard: true,
        },
      },
    ],
    groupProperties: {
      addressSearch: {
        label: 'Adresssuche',
        resultDisplayMode: 'categorized',
        limitResults: 10,
      },
      badestellenSearch: {
        label: 'Badestellensuche',
        resultDisplayMode: 'categorized',
        limitResults: 10,
      },
    },
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
  featureStyles: './style.json',
}

export default mapConfig
