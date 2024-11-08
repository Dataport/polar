/* eslint-disable max-lines-per-function */
import internLayers from './internLayerConfig'
import { dishCloudBaseUrl, basemapGrau, alkisWfs, alkisWms } from './services'
import { denkmaelerWmsIntern, denkmaelerWfsIntern } from './servicesIntern'
import { shBlue } from './colors'

export const internMapConfiguration = (urlParamsForProd) => {
  return {
    scale: {
      showScaleSwitcher: true,
      zoomMethod: 'plugin/zoom/setZoomLevel',
    },
    layers: internLayers,
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
          url: urlParamsForProd.denkmaelerWfsInternUrl,
          queryParameters: {
            id: 'denkmaelerWfsIntern',
            srsName: 'EPSG:25832',
            typeName: 'TBLGIS_ORA',
            featurePrefix: 'app',
            xmlns: 'http://www.deegree.org/app',
            patternKeys: {
              hausnummer: '([0-9]+)',
              strasse: '([A-Za-z]+)',
              objektansprache: '([A-Za-z]+)',
              kreis_kue: '([A-Za-z]+)',
            },
            patterns: [
              '{{objektansprache}} {{strasse}} {{hausnummer}}, {{kreis_kue}}',
            ],
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
            maxFeatures: 120,
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
            patterns: [
              '{{gemarkung}} {{flstnrzae}}/{{flstnrnen}}, {{flstkennz}}',
              '{{gemarkung}} {{flstnrzae}}, {{flstkennz}}',
              '{{flstkennz}}',
            ],
          },
        },
      ],
      groupProperties: {
        groupDenkmalsuche: {
          label: 'Suche Denkmal, Adresse, Flurstück',
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
