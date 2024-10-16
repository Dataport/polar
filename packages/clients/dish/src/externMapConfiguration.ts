// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */

import { shBlue } from './colors'
import {
  denkmaelerWfsExtern,
  denkmaelerWMS,
  hintergrundkarte,
  dishBaseUrl,
  alkisWfs,
} from './services'

export const exportMapConfiguration = {
  geoLocation: {
    checkLocationInitially: false,
    toastAction: 'plugin/toast/addToast',
    zoomLevel: 7,
  },
  layers: [
    {
      id: hintergrundkarte,
      visibility: true,
      type: 'background',
      name: 'Basemap Graustufen',
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
      id: alkisWfs,
      visibility: false,
      type: 'mask',
      name: 'ALKIS Katasterbezirke (WFS)',
      minZoom: 7,
    },
  ],
  attributions: {
    initiallyOpen: true,
    layerAttributions: [
      {
        id: hintergrundkarte,
        title:
          'Karte Basemap.de Web Raster Grau: © <a href="https://basemap.de/" target="_blank">basemap.de / BKG</a> <MONTH> <YEAR>',
      },
      {
        id: denkmaelerWfsExtern,
        title:
          'Karte Kulturdenkmale (Denkmalliste) (WFS): © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a> <MONTH> <YEAR>',
      },
      {
        id: denkmaelerWMS,
        title:
          'Karte Kulturdenkmale (Denkmalliste): © <a href="https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html" target="_blank">Landesamt für Denkmalpflege</a> <MONTH> <YEAR>',
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
      {
        groupId: 'groupDenkmalsuche',
        categoryId: 'categoryDenkmalsucheAutocomplete',
        type: 'autocomplete',
        // NOTE exotic, doesn't need URL
        url: 'example.com',
      },
      {
        groupId: 'groupDenkmalsuche',
        categoryId: 'categoryDenkmalsucheDish',
        type: 'dish',
        url: `${dishBaseUrl}/dish_service/service.aspx`,
        queryParameters: {
          wfsConfiguration: {
            id: denkmaelerWfsExtern,
            srsName: 'EPSG:25832',
            typeName: 'dish_shp',
            fieldName: 'objektid',
            featurePrefix: 'app',
            xmlns: 'http://www.deegree.org/app',
          },
          maxFeatures: 120,
          searchKey: 'volltext',
          addRightHandWildcard: true,
          topic: null,
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
        limitResults: 5,
      },
    },
    categoryProperties: {
      categoryDenkmalsucheAutocomplete: {
        label: 'Denkmalsuche Stichworte',
      },
      categoryDenkmalsucheDish: {
        label: 'Denkmalsuche Treffer',
      },
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
