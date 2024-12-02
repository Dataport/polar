// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import { LayerConfiguration } from '@polar/lib-custom-types'
import {
  denkmaelerWmsIntern,
  denkmaelerWfsIntern,
  kontrollbedarfIntern,
  verlustIntern,
  verwaltung,
  beschriftung,
  bddEinIntern,
  bddColIntern,
  aerialPhoto,
} from './servicesIntern'

import { basemapGrau, alkisWfs, alkisWms } from './services'

const layersIntern: LayerConfiguration[] = [
  {
    id: basemapGrau,
    visibility: false,
    type: 'background',
    name: 'Basemap Graustufen',
  },
  {
    id: bddEinIntern,
    visibility: true,
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
    name: 'ALKIS Katasterbezirke (WFS) Infoabfragelayer',
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
    name: 'Denkmal (WFS) Infoabfragelayer',
  },
  {
    id: beschriftung,
    visibility: true,
    type: 'mask',
    name: 'Beschriftung',
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
          '28': 'Mehrheit von baulichen Anlagen mit Kontrollbedarf',
          '29': 'Sachgesamtheit mit Kontrollbedarf',
          '23': 'Baudenkmal mit Kontrollbedarf',
          '22': 'Gründenkmal mit Kontrollbedarf',
          '21': 'Gewässer mit Kontrollbedarf',
          '20': 'Baudenkmal mit Kontrollbedarf (Flächen)',
          '19': 'Gründenkmal mit Kontrollbedarf (Flächen)',
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
        order: '7,8',
        title: {
          '7': 'Denkmalverlust',
          '8': 'Denkmalwertverlust',
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
    options: {
      layers: {
        order: 'Landesgrenzen,Kreisgrenzen,Aemtergrenzen,Gemeindegrenzen',
        title: {
          Landesgrenzen: 'Landesgrenzen',
          Kreisgrenzen: 'Kreisgrenzen',
          Aemtergrenzen: 'Ämtergrenzen',
          Gemeindegrenzen: 'Gemeindegrenzen',
        },
        legend: true,
      },
    },
  },
]

export default layersIntern
