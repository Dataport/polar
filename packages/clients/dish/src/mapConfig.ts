/* eslint-disable max-lines */
import merge from 'lodash.merge'
// number-only keys needed in layers object
/* eslint-disable @typescript-eslint/naming-convention */
import {
  hintergrundkarte,
  denkmaelerWFS,
  denkmaelerWMS,
  denkmaelerWFSIntern,
  dishBaseUrl,
  // servicePrefix, s.u.
} from './services'
import locales from './locales'

const shBlue = '#003064'
const shWhite = '#FFFFFF'

/*
from UI draft
const shRed = '#D4004B'
const shGrey = '#A4ADB6'
const shDarkBlue = '#001E49'
const ui 01 = '#1EAE9C';
const ui 04 = '#008CCF';
const unnamed = '#0089CA';
*/

let zoomLevel = 0

const commonMapConfiguration = {
  checkServiceAvailability: true,
  startResolution: 264.583190458,
  startCenter: [553655.72, 6004479.25],
  extent: [426205.6233, 5913461.9593, 650128.6567, 6101486.8776],
  locales,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: shBlue,
          primaryContrast: shWhite,
          secondary: shWhite,
          secondaryContrast: shBlue,
        },
      },
    },
  },
  options: [
    { resolution: 264.583190458, scale: 1000000, zoomLevel: zoomLevel++ },
    { resolution: 132.291595229, scale: 500000, zoomLevel: zoomLevel++ },
    { resolution: 66.14579761460263, scale: 250000, zoomLevel: zoomLevel++ },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: zoomLevel++ },
    { resolution: 15.874991427504629, scale: 60000, zoomLevel: zoomLevel++ },
    { resolution: 10.583327618336419, scale: 40000, zoomLevel: zoomLevel++ },
    { resolution: 5.2916638091682096, scale: 20000, zoomLevel: zoomLevel++ },
    { resolution: 2.6458319045841048, scale: 10000, zoomLevel: zoomLevel++ },
    { resolution: 1.3229159522920524, scale: 5000, zoomLevel: zoomLevel++ },
    { resolution: 0.6614579761460262, scale: 2500, zoomLevel: zoomLevel++ },
    { resolution: 0.2645831904584105, scale: 1000, zoomLevel: zoomLevel++ },
    { resolution: 0.1322915952292052, scale: 500, zoomLevel: zoomLevel++ },
    { resolution: 0.06614579761, scale: 250, zoomLevel: zoomLevel++ },
    { resolution: 0.02645831904, scale: 100, zoomLevel: zoomLevel++ },
    { resolution: 0.01322915952, scale: 50, zoomLevel: zoomLevel++ },
  ],
}

const internMapConfiguration = {
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
      id: denkmaelerWFSIntern,
      visibility: false,
      hideInMenu: true,
      type: 'mask',
      name: 'Denkmal (WFS) Intern',
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
  gfi: {
    mode: 'intersects',
    layers: {
      [denkmaelerWFSIntern]: {
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

const exportMapConfiguration = {
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
      id: denkmaelerWFS,
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
        id: denkmaelerWFS,
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
            id: denkmaelerWFS,
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
      [denkmaelerWFS]: {
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

export const getMapConfiguration = (mode: string) => {
  const config = merge({
    ...commonMapConfiguration,
    ...(mode === 'INTERN' ? internMapConfiguration : exportMapConfiguration),
  })
  return config
}
