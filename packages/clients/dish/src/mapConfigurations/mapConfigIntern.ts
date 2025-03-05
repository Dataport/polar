// function includes all plugin configs specifically for internal map use
/* eslint-disable max-lines-per-function */
import { SearchMethodConfiguration } from '@polar/lib-custom-types'
import { alkisWfService } from '../services'
import {
  alkisWfs,
  bddEin,
  bddCol,
  dop20col,
  denkmaelerWMS,
  denkmaelerWFS,
  kontrollbedarf,
  verlust,
  verwaltung,
} from '../servicesConstants'
import { shBlue } from '../colors'
import { DishMapConfig, DishUrlParams } from '../types'
import {
  categoryProps,
  groupProperties,
  searchMethods,
} from './searchConfigParams'
import layersIntern from './layerConfigIntern'
import {
  attributionsBasemapGrau,
  attributionsAlkisWms,
  denkmalAmtLink,
  vermessungsAmtLink,
} from './attributionsConfig'

export const mapConfigIntern = (urlParams: DishUrlParams): DishMapConfig => ({
  checkServiceAvailability: true,
  scale: {
    showScaleSwitcher: true,
    zoomMethod: 'plugin/zoom/setZoomLevel',
  },
  layers: layersIntern,
  attributions: {
    initiallyOpen: false,
    layerAttributions: [
      attributionsBasemapGrau,
      {
        id: bddEin,
        title: `Grundkarte Graustufen: © ${vermessungsAmtLink}`,
      },
      {
        id: bddCol,
        title: `Grundkarte Farbe: © ${vermessungsAmtLink}`,
      },
      {
        id: dop20col,
        title: `Luftbild (Farbe): © ${vermessungsAmtLink}`,
      },
      attributionsAlkisWms,
      {
        id: denkmaelerWMS,
        title: `Karte Kulturdenkmale (Denkmalliste): © ${denkmalAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: kontrollbedarf,
        title: `Karte Objekte mit Kontrollbedarf: © ${denkmalAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: verlust,
        title: `Karte Verlust: © ${denkmalAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: verwaltung,
        title: `Verwaltungsgrenzen: © ${vermessungsAmtLink}`,
      },
    ],
    staticAttributions: [
      `<span>Geobasisdaten: © GeoBasis-DE / <a href="https://www.bkg.bund.de/">BKG</a> 2024 <a href="http://sg.geodatenzentrum.de/web_public/nutzungsbedingungen.pdf">Nutzungsbedingungen</a></span>`,
      '<a href="#" onclick="window.openBenutzungshinweise(true)">Benutzungshinweise</a>',
    ],
  },
  dishModal: {
    isInternMap: true,
  },
  draw: {
    selectableDrawModes: ['Circle', 'LineString', 'Point', 'Polygon', 'Text'],
    textStyle: {
      textColor: '#e51313',
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
    download: false,
    showPng: true,
    showJpg: false,
    showPdf: false,
  },
  addressSearch: {
    searchMethods: [
      {
        ...searchMethods.denkmalsucheDishIntern,
        url: `${urlParams.internServicesBaseUrl}/wfs`,
      } as SearchMethodConfiguration,
      searchMethods.bkgSearch,
      {
        ...searchMethods.alkisSearch,
        url: alkisWfService('INTERN').url,
      },
    ],
    groupProperties,
    categoryProperties: {
      [searchMethods.denkmalsucheDishIntern.categoryId]:
        categoryProps[searchMethods.denkmalsucheDishIntern.categoryId],
      [searchMethods.bkgSearch.categoryId]:
        categoryProps[searchMethods.bkgSearch.categoryId],
      [searchMethods.alkisSearch.categoryId]:
        categoryProps[searchMethods.alkisSearch.categoryId],
    },
    minLength: 3,
  },
  gfi: {
    mode: 'intersects',
    // alkisWfs needs to be last in layer array because of specific gfi display
    layers: {
      [denkmaelerWFS]: {
        geometry: true,
        window: true,
        maxFeatures: 10,
        geometryName: 'app:geometry',
      },
      [alkisWfs]: {
        geometry: false,
        window: true,
        maxFeatures: 5,
        geometryName: 'geometry',
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
        color: 'rgb(255, 255, 255, 0.3)',
      },
    },
  },
  pins: {
    toZoomLevel: 8,
    movable: 'drag',
    style: {
      fill: shBlue,
    },
  },
  dishExportMap: {
    printApproach: 'scale',
    printRequester: 'client',
    xPrint: 18,
    yPrint: 20,
    versionHintergrund: '1.1.1',
    proxyHintergrund: 'y',
    versionWMS: '1.1.1',
    layerNameWMS:
      '0,9,1,10,2,11,3,12,4,13,25,27,24,26,6,15,19,30,20,31,21,32,22,33,23,34,29,36,28,35',
    versionWFS: '1.1.0',
    propertyNameWFS: 'objektid',
    filterTypeWFS: 'EQUAL_TO',
    printImagePath: 'ContentMapsTmp',
    urlParams,
  },
})
