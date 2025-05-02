// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import { LayerConfiguration } from '@polar/lib-custom-types'
import {
  denkmaelerWMS,
  denkmaelerWFS,
  bddEin,
  bddCol,
  dop20col,
  basemapGrau,
  alkisWms,
  alkisWfs,
  kontrollbedarf,
  verlust,
  verwaltung,
  beschriftung,
} from '../servicesConstants'

const layersIntern: LayerConfiguration[] = [
  {
    id: basemapGrau,
    visibility: true,
    type: 'background',
    name: 'Basemap.de Graustufen',
  },
  {
    id: bddEin,
    visibility: false,
    type: 'background',
    name: 'Grundkarte Graustufen',
  },
  {
    id: bddCol,
    visibility: false,
    type: 'background',
    name: 'Grundkarte Farbe',
  },
  {
    id: dop20col,
    visibility: false,
    type: 'background',
    name: 'Luftbild (Farbe)',
  },
  {
    id: beschriftung,
    visibility: true,
    type: 'mask',
    name: 'Beschriftung (ab 1:2.500)',
    minZoom: 9,
  },
  {
    id: denkmaelerWFS,
    visibility: false,
    hideInMenu: true,
    type: 'mask',
    name: 'Denkmal (WFS) Infoabfragelayer',
  },
  {
    id: denkmaelerWMS,
    visibility: true,
    type: 'mask',
    name: 'Kulturdenkmale',
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
    id: kontrollbedarf,
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
          '20': 'Baudenkmal (Fläche) mit Kontrollbedarf',
          '19': 'Gründenkmal (Fläche) mit Kontrollbedarf',
        },
        legend: true,
      },
    },
  },
  {
    id: verlust,
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
    name: 'ALKIS Flurstücke (ab 1:1.000)',
    minZoom: 10,
  },
]

export default layersIntern
