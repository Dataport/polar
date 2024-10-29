/* eslint-disable prettier/prettier */
// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import {
  dishCloudBaseUrl,
  internServicesBaseUrl,
  hintergrundkarte,
  denkmaelerWmsIntern,
  denkmaelerWFSIntern,
  kontrollbedarfIntern,
  alkisWfs,
  alkisWms,
  verwaltung,
} from './services'
import { shBlue } from './colors'

export const internMapConfiguration = {
  scale: {
    showScaleSwitcher: true,
    zoomMethod: 'plugin/zoom/setZoomLevel',
  },
  layers: [
    {
      id: hintergrundkarte,
      visibility: true,
      type: 'background',
      name: 'Basemap Graustufen',
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
      id: denkmaelerWFSIntern,
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
          order: '6,24,25,4,3,2,1,0',
          title: {
            '6': 'Denkmalbereich',
            '24': 'Mehrheit von baulichen Anlagen',
            '25': 'Sachgesamtheit',
            '4': 'Baudenkmal',
            '3': 'Gründenkmal',
            '2': 'Gewässer',
            '1': 'Baudenkmal (Fläche)',
            '0': 'Gründenkmal (Fläche)',
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
          order: '28,29,23,22,21,20,19',
          title: {
            '28': 'Mehrheit von bauliche Anlagen mit Kontrollbedarf',
            '29': 'Sachgesamtheit mit Kontrollbedarf',
            '23': 'Baudenkmale (Einzel) mit Kontrollbedarf',
            '22': 'Gartendenkmale (Elemente) mit Kontrollbedarf',
            '21': 'Gewässer mit Kontrollbedarf',
            '20': 'Baudenkmale (Flächen) mit Kontrollbedarf',
            '19': 'Gartendenkmale (Flächen) mit Kontrollbedarf',
          },
          legend: true,
        },
      },
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
    renderType: 'footer',
    layerAttributions: [
      {
        id: hintergrundkarte,
        title: 'Hintergrundkarten ©basemap.de/BKG;Geobasis-DE/LVermGeo SH',
      },
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
          id: denkmaelerWFSIntern,
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
      [denkmaelerWFSIntern]: {
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
