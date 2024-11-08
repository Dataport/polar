// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import {
  denkmaelerWmsIntern,
  denkmaelerWfsIntern,
  kontrollbedarfIntern,
  verlustIntern,
  verwaltung,
  bddEinIntern,
  bddColIntern,
  aerialPhoto,
} from './servicesIntern'

import { basemapGrau, alkisWfs, alkisWms } from './services'

const internLayers = [
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
      Landesgrenzen: 'Landesgrenzen',
      Kreisgrenzen: 'Kreisgrenzen',
      Aemtergrenzen: 'Ämtergrenzen',
      Gemeindegrenzen: 'Gemeindegrenzen',
    },
    legend: true,
  },
]

export default internLayers
