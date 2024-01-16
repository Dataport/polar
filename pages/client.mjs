import client from './node_modules/@polar/client-generic/dist/polar-client.mjs'

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
    stylePath: './node_modules/@polar/client-generic/dist/polar-client.css',
  },
}

const scenarioLayer = {
  name: 'Attributions, LayerChooser, & Legend',
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
          id: '23050',
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
        id: '23050',
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
  description:
    'POLAR can handle an <i>arbitrary</i> amount of switchable background and togglable subject layers. Both copyright information and layer legend previews are displayed in additional plugins. For more complex WMS layers, a sub-layer menu exists. See the <a target="_blank" href="https://static.hamburg.de/kartenclient/prod/">monument map ↗</a> for an example of that.',
}

const scenarioAddress = {
  name: 'AddressSearch, Pins, & Reverse Geocoder',
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
  description:
    'These plugins can be mixed to help with locating a coordinate and/or address. Users may use either the address search element directly, or create/move a pin to get an address. Click anywhere in the map to get started.',
}

const scenarioDraw = {
  name: 'Draw & Export',
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
  description:
    "Allows the user to draw information and text to the map and making a screenshot to forward the information in the procedure. It's also confiugurable to offer the image as download directly.",
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
      }
    })
  },
}

const scenarioGfi = {
  name: 'Gfi & Filter',
  enabledPlugins: ['icon-menu', 'filter', 'gfi'],
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
                46: 'E-Mobility charging stations',
              },
              category: {
                46: {
                  title: {
                    ladesaeule_status: 'Status of charging station',
                  },
                  ladesaeule_status: {
                    frei: 'Free',
                    'teilweise belegt': 'Partially occupied',
                    belegt: 'Occupied',
                  },
                },
              },
            },
          },
        },
      },
    ],
    layers: [
      {
        id: '452',
        visibility: true,
        type: 'background',
      },
      {
        id: '46',
        visibility: true,
        type: 'mask',
      },
    ],
    filter: {
      layers: {
        46: {
          categories: [
            {
              targetProperty: 'ladesaeule_status',
              knownValues: ['frei', 'teilweise belegt', 'belegt'],
            },
          ],
        },
      },
    },
    gfi: {
      mode: 'bboxDot',
      layers: {
        46: {
          geometry: false,
          window: true,
          properties: {
            str: 'Straße',
            hsnr: 'Hausnummer',
          },
          showTooltip: (feature) => [
            ['h2', 'Address'],
            ['span', feature.get('adresse')],
          ],
        },
      },
    },
  },
  description: 'Filtering features and retrieving the information needed.',
}

/* {
  name: 'Fullscreen, Geo Location, Scale, & Zoom',
  // TODO
  enabledPlugins: [],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',},
  description:
    'For intense work, the client can be toggled into fullscreen. Allowing users to identify their position in relation to the geospatial data. A scale to better estimate sizes of shown contents.Zoom buttons as additional navigational tools.',
},
{
  name: 'Toast',
  // TODO
  enabledPlugins: [],
  mapConfiguration: {
    language: 'en',
    epsg: 'EPSG:25832',},
  description: 'Show information to users.',
},
// TODO fully overridable localization and language switching!
// TODO example where inputs outside are modified
*/

for (const {
  name,
  mapConfiguration,
  enabledPlugins,
  description,
  postCreation,
} of [scenarioGfi]) {
  const id = name
    .toLowerCase()
    .replaceAll(' & ', '-')
    .replaceAll(' ', '-')
    .replaceAll(',', '')
  const aside = document.createElement('aside')
  aside.style = 'width: 100% !important'
  const parameterObject = {
    ...commonParameters,
    containerId: id,
    enabledPlugins,
    mapConfiguration: {
      ...commonParameters.mapConfiguration,
      ...mapConfiguration,
    },
  }
  aside.innerHTML = `
    <h3>${name}</h3>
    <p>${description}</p>
    <div id="${id}" class="polarstern"></div>
    <details>
      <summary>View configuration</summary>
      <p>
        <pre>
          <code>
client.createMap(${JSON.stringify(parameterObject, null, 2)})
          </code>
        </pre>
      </p>
    </details>
  `

  document.getElementById('plugin-gallery').appendChild(aside)

  client.createMap(parameterObject).then((mapClient) => {
    if (postCreation) {
      postCreation({ mapClient, id })
    }
  })
}
