/* eslint-disable max-lines-per-function */
import { alkisWfs } from '../services'
import {
  denkmaelerWmsIntern,
  denkmaelerWfsIntern,
  bddEinIntern,
  bddColIntern,
  aerialPhoto,
  kontrollbedarfIntern,
  verlustIntern,
  verwaltung,
} from '../servicesIntern'
import { shBlue } from '../colors'
import {
  categoryProps,
  groupProperties,
  searchMethods,
} from './searchConfigParams'
import layersIntern from './layerConfigIntern'
import {
  attributionsCommon,
  denkmalAmtLink,
  vermessungsAmtLink,
} from './layerAttributions'

export const mapConfigIntern = (internServicesBaseUrl: string) => {
  return {
    scale: {
      showScaleSwitcher: true,
      zoomMethod: 'plugin/zoom/setZoomLevel',
    },
    layers: layersIntern,
    attributions: {
      initiallyOpen: false,
      layerAttributions: [
        ...attributionsCommon,
        {
          id: denkmaelerWmsIntern,
          title: `Karte Kulturdenkmale (Denkmalliste): © ${denkmalAmtLink} <MONTH> <YEAR>`,
        },
        {
          id: kontrollbedarfIntern,
          title: `Karte Objekte mit Kontrollbedarf: © ${denkmalAmtLink} <MONTH> <YEAR>`,
        },
        {
          id: verlustIntern,
          title: `Karte Verlust: © ${denkmalAmtLink} <MONTH> <YEAR>`,
        },
        {
          id: verwaltung,
          title: `Verwaltungsgrenzen: © ${vermessungsAmtLink}`,
        },
        {
          id: bddEinIntern,
          title: `Grundkarte Graustufen: © ${vermessungsAmtLink}`,
        },
        {
          id: bddColIntern,
          title: `Grundkarte Farbe: © ${vermessungsAmtLink}`,
        },
        {
          id: aerialPhoto,
          title: `Luftbilder Farbe: © ${vermessungsAmtLink}`,
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
          url: `${internServicesBaseUrl}/wfs`,
        },
        searchMethods.bkgSearch,
        searchMethods.alkisSearch,
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
        [denkmaelerWfsIntern]: {
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
      toZoomLevel: 7,
      movable: 'drag',
      style: {
        fill: shBlue,
      },
    },
  }
}
