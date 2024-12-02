/* eslint-disable max-lines-per-function */
import layersIntern from './layerConfigIntern'
import { basemapGrau, alkisWfs, alkisWms } from './services'
import {
  categoryProps,
  groupProperties,
  searchMethods,
} from './searchConfigParams'
import {
  denkmaelerWmsIntern,
  denkmaelerWfsIntern,
  bddEinIntern,
  bddColIntern,
  aerialPhoto,
  kontrollbedarfIntern,
  verlustIntern,
  verwaltung,
} from './servicesIntern'
import { shBlue } from './colors'

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
        {
          id: basemapGrau,
          title:
            'Karte Basemap.de Web Raster Grau: © <a href="https://basemap.de/" target="_blank">basemap.de / BKG</a> <MONTH> <YEAR>',
        },
        {
          id: alkisWms,
          title:
            'Karte Flurstücke gemäss ALKIS-Objektartenkatalog © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">Landesamt für Vermessung und Geoinformation</a>',
        },
        {
          id: denkmaelerWmsIntern,
          title:
            'Karte Kulturdenkmale (Denkmalliste): © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a> <MONTH> <YEAR>',
        },
        {
          id: kontrollbedarfIntern,
          title:
            'Karte Objekte mit Kontrollbedarf: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a> <MONTH> <YEAR>',
        },
        {
          id: verlustIntern,
          title:
            'Karte Verlust: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a> <MONTH> <YEAR>',
        },
        {
          id: verwaltung,
          title:
            'Verwaltungsgrenzen: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">Landesamt für Vermessung und Geoinformation</a>',
        },
        {
          id: bddEinIntern,
          title:
            'Grundkarte Graustufen: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">Landesamt für Vermessung und Geoinformation</a>',
        },
        {
          id: bddColIntern,
          title:
            'Grundkarte Farbe: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">Landesamt für Vermessung und Geoinformation</a>',
        },
        {
          id: aerialPhoto,
          title:
            'Luftbilder Farbe: © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LVERMGEOSH" target="_blank">Landesamt für Vermessung und Geoinformation</a>',
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
