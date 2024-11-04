/* eslint-disable max-lines */
/* eslint-disable prettier/prettier */
// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import {
  dishCloudBaseUrl,
  basemapGrau,
  alkisWfs,
  alkisWms,
} from './services'
import { 
  internServicesBaseUrl,
  denkmaelerWmsIntern,
  denkmaelerWfsIntern,
  kontrollbedarfIntern,
  verlustIntern,
  verwaltung,
  bddEinIntern,
  bddColIntern,
  aerialPhoto,
 } from './servicesIntern'
import { shBlue } from './colors'

export const internMapConfiguration = {
  scale: {
    showScaleSwitcher: true,
    zoomMethod: 'plugin/zoom/setZoomLevel',
  },
  layers: [
    {
      id: basemapGrau,
      visibility: true,
      type: 'background',
      name: 'Basemap Graustufen',
    },
    {
      id: bddEinIntern,
      visibility: false,
      type: 'background',
      name: 'Grundkarte Graustufen',
    },
    {
      id: bddColIntern,
      visibility: false,
      type: 'background',
      name: 'Grundkarte Farbe',
    },
    {
      id: aerialPhoto,
      visibility: false,
      type: 'background',
      name: 'Luftbilder Farbe',
    },
    {
      id: alkisWfs,
      visibility: false,
      hideInMenu: true,
      gfiMode: 'bboxDot',
      type: 'mask',
      name: 'ALKIS Katasterbezirke (WFS)',
    },
    {
      id: alkisWms,
      visibility: false,
      type: 'mask',
      name: 'ALKIS Flurstücke (WMS)',
      minZoom: 10,
    },
    {
      id: denkmaelerWfsIntern,
      visibility: false,
      hideInMenu: true,
      type: 'mask',
      name: 'Denkmal (WFS) Intern',
    },
    {
      id: denkmaelerWmsIntern,
      visibility: true,
      type: 'mask',
      name: 'Kulturdenkmale (Denkmalliste)',
      options: {
        layers: {
          order: '6,15,24,26,25,27,4,13,3,12,2,11,1,10,0,9',
          title: {
            '6': 'Denkmalbereichsverordnung',
            '15': 'Denkmalbereichsverordnung Label',
            '24': 'Mehrheit von baulichen Anlagen',
            '26': 'Mehrheit von baulichen Anlagen Label',
            '25': 'Sachgesamtheit',
            '27': 'Sachgesamtheit Label',
            '4': 'Baudenkmal (Einzeldenkmale)',
            '13': 'Baudenkmal (Einzeldenkmale) Label',
            '3': 'Gründenkmal (Elemente)',
            '12': 'Gründenkmal (Elemente) Label',
            '2': 'Gewässer',
            '11': 'Gewässer Label',
            '1': 'Baudenkmal (Fläche)',
            '10': 'Baudenkmal (Fläche) Label',
            '0': 'Gründenkmal (Fläche)',
            '9': 'Gründenkmal (Fläche) Label',
          },
          legend: true,
        },
      },
    },
    {
      id: kontrollbedarfIntern,
      visibility: true,
      type: 'mask',
      name: 'Objekte mit Kontrollbedarf',
      options: {
        layers: {
          order: '28,35,29,36,23,34,22,33,21,32,20,31,19,30',
          title: {
            '28': 'Mehrheit von bauliche Anlagen mit Kontrollbedarf',
            '35': 'Mehrheit von bauliche Anlagen mit Kontrollbedarf Label',
            '29': 'Sachgesamtheit mit Kontrollbedarf',
            '36': 'Sachgesamtheit mit Kontrollbedarf Label',
            '23': 'Baudenkmale (Einzeldenkmale) mit Kontrollbedarf',
            '34': 'Baudenkmale (Einzeldenkmale) mit Kontrollbedarf Label',
            '22': 'Gartendenkmale (Elemente) mit Kontrollbedarf',
            '33': 'Gartendenkmale (Elemente) mit Kontrollbedarf Label',
            '21': 'Gewässer mit Kontrollbedarf',
            '32': 'Gewässer mit Kontrollbedarf Label',
            '20': 'Baudenkmale (Flächen) mit Kontrollbedarf',
            '31': 'Baudenkmale (Flächen) mit Kontrollbedarf Label',
            '19': 'Gartendenkmale (Flächen) mit Kontrollbedarf',
            '30': 'Gartendenkmale (Flächen) mit Kontrollbedarf Label',
          },
          legend: true,
        },
      },
    },
    {
      id: verlustIntern,
      visibility: false,
      type: 'mask',
      name: 'Verlust',
      options: {
        layers: {
          order: '7,16,8,17',
          title: {
            '7': 'Denkmalverlust',
            '16': 'Denkmalverlust Label',
            '8': 'Denkmalwertverlust',
            '17': 'Denkmalwertverlust Label',
          },
          legend: true,
        }
      }
    },
    {
      id: verwaltung,
      visibility: false,
      type: 'mask',
      name: 'Verwaltungsgrenzen',
      order: 'Landesgrenzen,Kreisgrenzen,Aemtergrenzen,Gemeindegrenzen',
      title: {
        'Landesgrenzen': 'Landesgrenzen',
        'Kreisgrenzen': 'Kreisgrenzen',
        'Aemtergrenzen': 'Ämtergrenzen',
        'Gemeindegrenzen': 'Gemeindegrenzen',
      },
      legend: true,
    },
  ],
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
      }
    ],
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
    download: true,
    showPng: true,
    showJpg: false,
    showPdf: false,
  },
  addressSearch: {
    searchMethods: [
      {
        groupId: 'groupDenkmalsuche',
        categoryId: 'categoryDenkmalSuche',
        type: 'wfs',
        url: `${internServicesBaseUrl}/wfs`,
        queryParameters: {
          id: denkmaelerWfsIntern,
          srsName: 'EPSG:25832',
          typeName: 'TBLGIS_ORA',
          featurePrefix: 'app',
          xmlns:
            'http://www.deegree.org/app',
          patternKeys: {
            hausnummer: '([0-9]+)',
            strasse: '([A-Za-z]+)',
            objektansprache: '([A-Za-z]+)',
            kreis_kue: '([A-Za-z]+)',
          },
          patterns: ['{{objektansprache}} {{strasse}} {{hausnummer}}, {{kreis_kue}}'],
        },
      },
      {
        groupId: 'groupDenkmalsuche',
        categoryId: 'categoryBkgSuche',
        queryParameters: {
          filter: {
            bundesland: 'Schleswig-Holstein',
          },
        },
        type: 'bkg',
        url: `${dishCloudBaseUrl}/dish/bkg/search/geosearch.json`,
      },
      {
        groupId: 'groupDenkmalsuche',
        categoryId: 'categoryAlkisSuche',
        type: 'wfs',
        url: `${dishCloudBaseUrl}/dish/bkg/ALKIS_WFS`,
        queryParameters: {
          id: alkisWfs,
          srsName: 'EPSG:25832',
          typeName: 'Flurstueck',
          featurePrefix: 'ave',
          xmlns:
            'http://repository.gdi-de.org/schemas/adv/produkt/alkis-vereinfacht/2.0',
          patternKeys: {
            flstnrnen: '([0-9]+)',
            flstnrzae: '([0-9]+)',
            gemarkung: '([A-Za-z]+)',
            flstkennz: '([0-9_]+)',
          },
          patterns: ['{{gemarkung}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}', '{{gemarkung}} {{flstnrzae}}, {{flstkennz}}', '{{flstkennz}}'],
        },
      },
    ],
    groupProperties: {
      groupDenkmalsuche: {
        label: 'Denkmalsuche',
        hint: 'common:dish.addressSearchHint',
        resultDisplayMode: 'categorized',
        limitResults: 3,
      },
      defaultGroup: {
        limitResults: 3,
      },
    },
    categoryProperties: {
      categoryDenkmalSuche: {
        label: 'Denkmalsuche Treffer',
      },
      categoryBkgSuche: {
        label: 'Adresssuche Treffer',
      },
      categoryAlkisSuche: {
        label: 'Flurstückssuche Treffer',
      },
    },
    minLength: 3,
  },
  gfi: {
    mode: 'intersects',
    layers: {
      [denkmaelerWfsIntern]: {
        geometry: true,
        window: true,
        maxFeatures: 10,
        geometryName: 'app:geometry',
      },
      [alkisWfs]: {
        geometry: true,
        window: true,
        maxFeatures: 5,
        geometryName: 'geometry',
      }
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

