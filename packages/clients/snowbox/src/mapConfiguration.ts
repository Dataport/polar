import { Feature as GeoJsonFeature } from 'geojson'
import {
  ExtendedMasterportalapiMarkersIsSelectableFunction,
  GfiIsSelectableFunction,
} from '@polar/lib-custom-types'
import language from './language'

const eigengrau = '#16161d'
const somewhatBlue = '#002177'
const notQuiteWhite = '#f2f3f4'

const basemapId = '23420'
const basemapGreyId = '23421'
const sBahn = '23050'
const uBahn = '23053'
export const reports = '6059'
const ausgleichsflaechen = '1454'

const hamburgBorder = '6074'

const isAusgleichsflaecheActive = (feature: GeoJsonFeature) =>
  ['08.07.1997', '02.05.1991', '21.02.2003', '08.12.1989'].includes(
    feature.properties?.vorhaben_zulassung_am
  )

// arbitrary condition for testing
const isEvenId = (mmlid: string) => Number(mmlid.slice(-1)) % 2 === 0

const isReportActive: GfiIsSelectableFunction = (feature) =>
  feature.properties?.features
    ? // client is in cluster mode
      feature.properties?.features.reduce(
        (accumulator, current) =>
          // NOTE: that's how ol/GeoJSON packs clustered features as GeoJSON
          isEvenId(current.values_.mmlid) || accumulator,
        false
      )
    : isEvenId(feature.properties?.mmlid)

const isReportSelectable: ExtendedMasterportalapiMarkersIsSelectableFunction = (
  feature
) =>
  feature
    .get('features')
    .reduce(
      (accumulator, current) => isEvenId(current.get('mmlid')) || accumulator,
      false
    )

export const mapConfiguration = {
  language: 'en',
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
  featureStyles: './style.json',
  extendedMasterportalapiMarkers: {
    layers: [reports],
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
    unselectableStyle: {
      stroke: '#FFFFFF',
      fill: '#333333',
    },
    isSelectable: isReportSelectable,
    clusterClickZoom: true,
  },
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
      {
        id: reports,
        title: 'snowbox.attributions.reports',
      },
      {
        id: ausgleichsflaechen,
        title: 'snowbox.attributions.ausgleichsflaechen',
      },
    ],
  },
  draw: {
    measureOptions: {
      metres: true,
      kilometres: true,
      hectares: true,
    },
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
    mode: 'bboxDot',
    activeLayerPath: 'plugin/layerChooser/activeMaskIds',
    multiSelect: 'circle',
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
      [reports]: {
        geometry: false,
        window: true,
        // only one of these will be displayed, depending on whether (extended markers && clusters) are on
        properties: ['_gfiLayerId', 'mmlid'],
        isSelectable: isReportActive,
      },
      [ausgleichsflaechen]: {
        geometry: true,
        window: true,
        properties: ['vorhaben', 'vorhaben_zulassung_am'],
        isSelectable: isAusgleichsflaecheActive,
      },
    },
    coordinateSources: [
      'plugin/pins/transformedCoordinate',
      'plugin/pins/coordinatesAfterDrag',
      'selectedCoordinates',
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
      id: ausgleichsflaechen,
      type: 'mask',
      name: 'snowbox.layers.ausgleichsflaechen',
      styleId: 'panda',
    },
    {
      id: reports,
      type: 'mask',
      name: 'snowbox.layers.reports',
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
    movable: 'drag',
    appearOnClick: {
      show: true,
      atZoomLevel: 0,
    },
    style: {
      fill: '#ff0019',
    },
  },
  routing: {
    serviceUrl: 'https://geodienste.hamburg.de/web_ors//v2/directions/',
    format: 'geojson',
    selectableTravelModes: [],
    selectablePreferences: [],
    displayPreferences: true,
    displayRouteTypesToAvoid: true,
    routeStyle: {
      stroke: {
        color: '#e51313',
        width: 6,
      },
    },
    addressSearch: {
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
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
  },
}
