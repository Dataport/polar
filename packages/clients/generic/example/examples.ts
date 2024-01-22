/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable max-lines */

import client from '../src/polar-client'
const id = 'polarstern'

const commonParameters = {
  services: 'https://geodienste.hamburg.de/services-internet.json',
  mapConfiguration: {
    epsg: 'EPSG:25832',
    layers: [
      {
        id: '453',
        visibility: true,
        type: 'background',
      },
    ],
  },
}

const scenarioLayer = {
  enabledPlugins: ['attributions', 'icon-menu', 'layer-chooser', 'legend'],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
    locales: [
      {
        type: 'en',
        resources: {
          example: {
            attributions: {
              basemap: 'Basemap © basemap.de / BKG <MONTH> <YEAR>',
              basemapGrey: 'Basemap Grey © basemap.de / BKG <MONTH> <YEAR>',
              underground:
                'Railway Lines U-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
              rapid:
                'Railway Lines S-Bahn © Freie und Hansestadt Hamburg, Behörde für Wirtschaft, Verkehr und Innovation',
            },
            layers: {
              basemap: 'Basemap.de (Coloured)',
              basemapGrey: 'Basemap.de (Grey)',
              underground: 'Underground railway (U-Bahn)',
              rapid: 'City rapid railway (S-Bahn)',
              hamburgBorder: 'City border Hamburg',
            },
          },
        },
      },
    ],
    attributions: {
      initiallyOpen: false,
      listenToChanges: [
        'plugin/layerChooser/activeBackgroundId',
        'plugin/layerChooser/activeMaskIds',
      ],
      windowWidth: 300,
      layerAttributions: [
        {
          id: '23420',
          title: 'example.attributions.basemap',
        },
        {
          id: '23421',
          title: 'example.attributions.basemapGrey',
        },
        {
          id: '2301711',
          title: 'example.attributions.underground',
        },
        {
          id: '23053',
          title: 'example.attributions.rapid',
        },
      ],
    },
    layers: [
      {
        id: '23420',
        visibility: true,
        type: 'background',
        name: 'example.layers.basemap',
      },
      {
        id: '23421',
        type: 'background',
        name: 'example.layers.basemapGrey',
      },
      {
        id: '2301711',
        visibility: true,
        type: 'mask',
        name: 'example.layers.underground',
      },
      {
        id: '23053',
        type: 'mask',
        name: 'example.layers.rapid',
      },
    ],
  },
}

const scenarioAddress = {
  enabledPlugins: [
    'address-search',
    'loading-indicator',
    'pins',
    'reverse-geocoder',
  ],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
    addressSearch: {
      displayComponent: true,
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      searchMethods: [
        {
          queryParameters: {
            searchAddress: true,
            searchStreets: true,
            searchHouseNumbers: true,
          },
          type: 'mpapi',
          url: 'https://geodienste.hamburg.de/HH_WFS_GAGES?service=WFS&request=GetFeature&version=2.0.0',
        },
      ],
      minLength: 3,
      waitMs: 300,
      focusAfterSearch: true,
    },
    loadingIndicator: {
      displayComponent: true,
    },
    pins: {
      coordinateSource: 'plugin/addressSearch/chosenAddress',
      toZoomLevel: 7,
      movable: true,
    },
    reverseGeocoder: {
      url: 'https://geodienste.hamburg.de/HH_WPS',
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      zoomTo: 7,
      coordinateSource: 'plugin/pins/transformedCoordinate',
      addressTarget: 'plugin/addressSearch/selectResult',
    },
  },
}

const scenarioDraw = {
  enabledPlugins: ['draw', 'export', 'icon-menu'],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
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
      showPng: true,
      showJpg: false,
      showPdf: false,
    },
  },
  postCreation: ({ mapClient, id }) => {
    const figure = document.createElement('figure')
    const imgId = `${id}-img`
    figure.innerHTML = `
    <img id="${imgId}" alt=""">
    <figcaption>The screenshot that can be made above will appear here.</figcaption>`
    document.getElementById(id).parentElement.parentElement.appendChild(figure)
    mapClient.subscribe('plugin/export/exportedMap', (screenshot) => {
      const imgElement = document.getElementById(imgId)
      if (imgElement && screenshot) {
        imgElement?.setAttribute('src', screenshot)
        imgElement.style = 'outline: 2px dashed black'
        // TODO fix, doesn't work :<
        mapClient.$store.dispatch('plugin/toast/addToast', {
          type: 'info',
          text: 'The screenshot was placed below the map.',
        })
      }
    })
  },
}

// TODO default GFI seems to be broken ...
const scenarioGfi = {
  enabledPlugins: ['icon-menu', 'filter', 'gfi'],
  modifyLayerConfiguration: (layerConf) => {
    layerConf.find((entry) => entry.id === '1711').clusterDistance = 40
    return layerConf
  },
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
    locales: [
      {
        type: 'en',
        resources: {
          plugins: {
            filter: {
              layerName: {
                1711: 'Hospital',
              },
              category: {
                1711: {
                  title: {
                    traegerschaft: 'Sponsorship',
                  },
                  traegerschaft: {
                    privat: 'Private',
                    öffentlich: 'Public',
                    freigemeinnützig: 'Non-profit',
                  },
                },
              },
            },
          },
        },
      },
    ],
    extendedMasterportalapiMarkers: {
      layers: ['1711'],
      defaultStyle: {
        stroke: '#FFFFFF',
        fill: '#005CA9',
      },
      hoverStyle: {
        stroke: '#46688E',
        fill: '#8BA1B8',
      },
      selectionStyle: {
        stroke: '#FFFFFF',
        fill: '#E10019',
      },
      clusterClickZoom: true,
      dispatchOnMapSelect: ['plugin/iconMenu/openMenuById', 'gfi'],
    },
    layers: [
      {
        id: '452',
        visibility: true,
        type: 'background',
      },
      {
        id: '1711',
        visibility: true,
        type: 'mask',
      },
    ],
    filter: {
      layers: {
        1711: {
          categories: [
            {
              targetProperty: 'traegerschaft',
              knownValues: ['privat', 'öffentlich', 'freigemeinnützig'],
            },
          ],
        },
      },
    },
    gfi: {
      mode: 'bboxDot',
      renderType: 'iconMenu',
      featureList: {
        mode: 'visible',
        pageLength: 5,
        text: ['name', 'adresse'],
      },
      layers: {
        1711: {
          geometry: false,
          window: true,
          properties: {
            name: 'Name',
            adresse: 'Address',
            ort: 'Address 2',
          },
          showTooltip: (feature) => [
            [
              'h2',
              feature.get('features').length > 1
                ? 'Multiple hospitals'
                : feature.get('features')[0].get('name'),
            ],
            [
              'span',
              feature.get('features').length > 1
                ? 'Click to zoom in'
                : feature.get('features')[0].get('adresse'),
            ],
          ],
        },
      },
    },
  },
}

let zoomLevel = 1
const scenarioOrientation = {
  enabledPlugins: ['fullscreen', 'geo-location', 'icon-menu', 'scale', 'zoom'],
  services: [
    {
      id: 'web_raster',
      name: 'WMS DE BASEMAP.DE WEB RASTER',
      url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
      typ: 'WMS',
      layers: 'de_basemapde_web_raster_grau',
      format: 'image/png',
      version: '1.3.0',
      singleTile: false,
      transparent: true,
    },
  ],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
    zoom: {
      showMobile: true,
    },
    startResolution: 529.166380916,
    startCenter: [553655.72, 6004479.25],
    extent: [
      272364.5953963266, 5243177.769112317, 884817.7737926682,
      6109485.046199471,
    ],
    options: [
      { resolution: 529.166380916, scale: 2000000, zoomLevel: zoomLevel++ },
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
    layers: [
      {
        id: 'web_raster',
        visibility: true,
        type: 'background',
      },
    ],
  },
}

const scenarioLocales = {
  // TODO build locale switcher and some custom locales
  enabledPlugins: [],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
  },
}

const scenarioSubscriptions = {
  // TODO use some plugins and fill forms with them
  enabledPlugins: [],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',
  },
}

const scenarios = {
  scenarioDraw,
  scenarioLocales,
  scenarioSubscriptions,
  scenarioOrientation,
  scenarioAddress,
  scenarioGfi,
  scenarioLayer,
}

async function renderLayer({
  mapConfiguration,
  enabledPlugins,
  postCreation,
  modifyLayerConfiguration,
  services,
}) {
  const div = document.createElement('div')
  div.id = id
  div.classList.add('polarstern')
  document.body.appendChild(div)

  const mapClient = await client.createMap({
    ...commonParameters,
    services: services || commonParameters.services,
    containerId: id,
    enabledPlugins,
    modifyLayerConfiguration,
    mapConfiguration: {
      ...commonParameters.mapConfiguration,
      ...mapConfiguration,
    },
  })
  if (postCreation) {
    postCreation({ mapClient, id })
  }
}

// RUNS
// renderLayer(scenarios.scenarioLayer)
// renderLayer(scenarios.scenarioAddress)
// renderLayer(scenarios.scenarioDraw)

// OOF
// renderLayer(scenarios.scenarioGfi)

// UNTESTED/-FINISHED
// renderLayer(scenarios.scenarioLocales)
renderLayer(scenarios.scenarioOrientation)
// renderLayer(scenarios.scenarioSubscriptions)

/*
const select = document.createElement('select')
select.innerHTML =
  '<option value="no">None</option>' +
  Object.keys(scenarios)
    .map((key) => `<option value="${key}">${key}</option>`)
    .join('')
document.body.appendChild(select)
select.addEventListener('change', renderLayer)
*/
