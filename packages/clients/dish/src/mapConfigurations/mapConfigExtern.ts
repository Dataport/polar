// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import { shBlue } from '../colors'
import {
  basemapGrau,
  alkisWms,
  denkmaelerWfsExtern,
  denkmaelerWMS,
  dop20col,
  bddCol,
  bddEin,
  alkisWfService,
} from '../services'
import { DishMapConfig } from '../types'
import {
  attributionsCommon,
  denkmalAmtLink,
  vermessungsAmtLink,
} from './attributionsConfig'
import {
  searchMethods,
  categoryProps,
  groupProperties,
} from './searchConfigParams'

export const mapConfigExtern: DishMapConfig = {
  checkServiceAvailability: false,
  geoLocation: {
    checkLocationInitially: false,
    toastAction: 'plugin/toast/addToast',
    zoomLevel: 7,
  },
  layers: [
    {
      id: basemapGrau,
      visibility: true,
      type: 'background',
      name: 'Basemap Graustufen',
    },
    {
      id: bddCol,
      visibility: true,
      type: 'background',
      name: 'Digitale Topographische Karten (Farbe)',
    },
    {
      id: bddEin,
      visibility: true,
      type: 'background',
      name: 'Digitale Topographische Karten (Graustufen)',
    },
    {
      id: dop20col,
      visibility: true,
      type: 'background',
      name: 'Luftbilder',
    },
    {
      id: denkmaelerWfsExtern,
      visibility: false,
      hideInMenu: true,
      type: 'mask',
      name: 'Denkmal (WFS)',
      minZoom: 7,
    },
    {
      id: denkmaelerWMS,
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
      id: alkisWms,
      visibility: true,
      type: 'mask',
      name: 'ALKIS Flurstücke (ab 1: 1000)',
      minZoom: 10,
    },
  ],
  attributions: {
    initiallyOpen: true,
    layerAttributions: [
      ...attributionsCommon,
      {
        id: dop20col,
        title: `Luftbilder: © ${vermessungsAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: bddCol,
        title: `Digitale Topographische Karten (Farbe): © ${vermessungsAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: bddEin,
        title: `Digitale Topographische Karten (Graustufen): © ${vermessungsAmtLink} <MONTH> <YEAR>`,
      },
      {
        id: denkmaelerWMS,
        title: `Karte Kulturdenkmale (Denkmalliste): © ${denkmalAmtLink} <MONTH> <YEAR>`,
      },
    ],
    staticAttributions: [
      `<ul style="display: flex; flex-direction: row; flex-wrap: wrap; column-gap: 8px; list-style-type: none; padding: 0; margin: 0">
          <li>
            <a href="https://www.schleswig-holstein.de/DE/Landesregierung/LD/Kontakt/kontakt_node.html" target="_blank">Kontakt</a>
          </li>
          <li>
            <a href="https://www.schleswig-holstein.de/DE/landesportal/servicemeta/impressum/impressum_node.html" target="_blank">Impressum</a>
          </li>
          <li>
            <a href="https://www.schleswig-holstein.de/DE/landesportal/servicemeta/datenschutz/datenschutz_node.html" target="_blank">Datenschutz</a>
          </li>
          <li>
            <a href="https://www.schleswig-holstein.de/DE/landesportal/servicemeta/barrierefreiheit/barrierefreiheit_node.html" target="_blank">Barrierefreiheit</a>
          </li>
          <li>
            <a href="https://www.schleswig-holstein.de/DE/landesportal/servicemeta/sitemap/sitemap_node.html" target="_blank">Sitemap</a>
          </li>
          <li>
            <a href="#" onclick="window.openBenutzungshinweise()">Benutzungshinweise</a>
          </li>
        </ul>`,
    ],
  },
  addressSearch: {
    searchMethods: [
      searchMethods.denkmalsucheAutocomplete,
      searchMethods.denkmalsucheDishExtern,
      searchMethods.bkgSearch,
      {
        ...searchMethods.alkisSearch,
        url: alkisWfService('EXTERN').url,
      },
    ],
    groupProperties,
    categoryProperties: {
      [searchMethods.denkmalsucheAutocomplete.categoryId]:
        categoryProps[searchMethods.denkmalsucheAutocomplete.categoryId],
      [searchMethods.denkmalsucheDishExtern.categoryId]:
        categoryProps[searchMethods.denkmalsucheAutocomplete.categoryId],
      [searchMethods.bkgSearch.categoryId]:
        categoryProps[searchMethods.bkgSearch.categoryId],
      [searchMethods.alkisSearch.categoryId]:
        categoryProps[searchMethods.alkisSearch.categoryId],
    },
    minLength: 3,
  },
  gfi: {
    mode: 'intersects',
    layers: {
      [denkmaelerWfsExtern]: {
        geometry: true,
        window: true,
        maxFeatures: 10,
        geometryName: 'app:geometry',
        exportProperty: 'Export',
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
