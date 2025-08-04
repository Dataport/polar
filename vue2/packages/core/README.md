# Core

## Scope

The client's core is the base package to create clients in the POLAR environment.

It offers this functionality:

- Plugin mechanism
- @masterportal/masterportalapi functionality
- Localization mechanism

## Interaction

If a client is rendered as part of another page, the zoom and drag-pan behaviour is different to if the client is rendered as complete page.  
If it's part of another page, drag-panning on mobile devices is only usable if at least two fingers are being used while on desktop clients the user can only zoom if using the respective platform modifier key (e.g. CTRL).  

It is important to note that the behaviour will be desktop-like on larger touchscreen devices (e.g. tablets).

## Initialization / Configuration

It depends on the client how exactly the initialization will take place for the embedding programmer. However, the core mechanism remains the same.

The exported default object is an extended masterportalapi, adding the `addPlugins` and extending the `createMap` functions. For masterportalapi details, [see their repository](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/).

#### mapConfiguration

| fieldName | type | description |
| - | - | - |
| <...masterportalapi.fields> | various | Multiple different parameters are required by the masterportalapi to be able to create the map. Also, some fields are optional but relevant and thus described here as well. For all additional options, refer to the documentation of the masterportalapi itself. |
| <plugin.fields> | various? | Fields for configuring plugins added with `addPlugins`. Refer to each plugin's documentation for specific fields and options. Global plugin parameters are described [below](#global-plugin-parameters). |

<details>
<summary>Example configuration</summary>

```ts
import locales from './locales'

const mapConfiguration = {
  stylePath: '../dist/polar-client.css',
  checkServiceAvailability: true,
  language: 'de',
  locales, // the locales object will normally be outsourced to another file
  layerConf, // the layerConf object will normally be outsourced to another file - for more information, see the relevant chapter
  layers: [
    // parts of the layer configuration can be outsourced to another file
    // and referenced in the mapConfiguration by id like the second layer
    {
      id: 'backgroundmap',
      name: 'WMS DE BASEMAP.DE WEB RASTER',
      url: 'https://sgx.geodatenzentrum.de/wms_basemapde',
      typ: 'WMS',
      layers: 'de_basemapde_web_raster_grau',
      format: 'image/png',
      version: '1.3.0',
      singleTile: false,
      transparent: true,
    },
    {
      id: '1561',
      visibility: true,
      type: 'mask',
      name: 'Building Plans',
      minZoom: 2,
    },
  ],
  addressSearch: {
    displayComponent: false,
  },
  export: {
    showPdf: false,
  },
  ...
}
```

</details>

##### mapConfiguration.featureStyles

Vector Layers (GeoJSON and WFS) can also be styled on the client side.
Configuration and implementation is based on [style.json](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev_vue/docs/User/Global-Config/style.json.md) of `@masterportal/masterportalapi`.
For the full documentation, including all rules that are applied when parsing the configuration, see the above linked documentation.

Example styling some points of a layer gray that have the value `food` in the property `not bamboo`.
All Other features will use the provided default green styling.
A Layer needs to use the property `styleId` in its `mapConfiguration.layers` entry and set it to `panda` to use this styling.

```json
[
  {
    "styleId": "panda",
    "rules": [
      {
        "conditions": {
          "properties": {
            "food": "bamboo"
          }
        },
        "style": {
          "circleStrokeColor": [3, 255, 1, 1],
          "circleFillColor": [3, 255, 1, 1]
        }
      },
      { 
        "style": {
          "circleStrokeColor": [128, 128, 128, 1],
          "circleFillColor": [128, 128, 128, 1]
        }
      }
    ]
  }
]
```

##### mapConfiguration.layerConf

The layer configuration (or: service register) is read by the `@masterportal/masterportalapi`. 

###### Example services register

```json
[
  {
    "id": "my-wfs-id",
    "name": "Service name",
    "url": "Service url",
    "typ": "WFS",
    "outputFormat": "XML",
    "version": "1.1.0",
    "featureType": "ns:featureType"
  },
  {
    "id": "my-wms-id",
    "name": "Service name",
    "url": "Service url",
    "typ": "WMS",
    "format": "image/png",
    "version": "1.3.0",
    "transparent": true,
    "layers": ["A", "B"]
  },
  {
    "id": "my-self-defined-wmts",
    "urls": [
      "url1/{TileMatrix}/{TileCol}/{TileRow}.png",
      "url2/{TileMatrix}/{TileCol}/{TileRow}.png",
      "url3/{TileMatrix}/{TileCol}/{TileRow}.png"
    ],
    "typ": "WMTS",
    "format": "image/png",
    "coordinateSystem": "EPSG:3857",
    "origin": [-20037508.3428, 20037508.3428],
    "transparent": false,
    "tileSize": "256",
    "minScale": "1",
    "maxScale": "2500000",
    "tileMatrixSet": "google3857",
    "requestEncoding": "REST",
    "resLength": "20"
  },
  {
    "id": "my-capabilities-wmts",
    "capabilitiesUrl": "WMTS capabilities url",
    "urls": "WMTS url",
    "optionsFromCapabilities": true,
    "tileMatrixSet": "EU_EPSG_25832_TOPPLUS",
    "typ": "WMTS",
    "layers": "layer-name",
    "legendURL": "my-legend-url"
  },
  {
    "id": "oaf",
    "typ": "OAF",
    "name": "My OAF",
    "url": "https://api.hamburg.de/datasets/v1/stadtgruen",
    "collection": "poi",
    "crs": "http://www.opengis.net/def/crs/EPSG/0/25832",
    "bboxCrs": "http://www.opengis.net/def/crs/EPSG/0/25832",
    "gfiTheme": "default",
  },
  {
    "id": "my-geojson",
    "name": "My GeoJSON data",
    "url": "Service url",
    "typ": "GeoJSON",
    "version": "1.0",
    "minScale": "0",
    "maxScale": "2500000",
    "legendURL": ""
  }
]
```

Since this is the base for many functions, the service id set in this is used to reference map material in many places of the map client.

##### <plugin.fields>

Plugins in POLAR are modular components that extend the functionality of the map client. They can be added using the [addPlugins](#addplugins) method and configured through the `mapConfiguration` object. Each plugin has its own set of fields and options that can be customized.

On how to configure a plugin, see the respective plugin. The configuration is given in the `mapConfiguration` object by the plugin's name as specified in its respective documentation.

###### Global Plugin Parameters

Most plugins honor this additional field.

| fieldName | type | description |
| - | - | - |
| displayComponent | boolean? | Optional field that allows hiding UI elements from the user. The store will still be initialized, allowing you to add your own UI elements and control the plugin's functionality via the Store. This may or may not make sense, depending on the plugin. Defaults to `false` , meaning the default UI is hidden. |

###### Example Configuration

For example, a `@polar/plugin-address-search` plugin can be configured like this:

```js
{
  addressSearch: {
    // Plugin-specific configuration
    displayComponent: true, // Optional field to control UI elements
    // ...
  }
}
```

## Teardown

In some single page applications, the map client may produce unexpected behaviour on rerenders. Should this occur in your environment, these hints should help:

* Use `mapInstance.$destroy()` in your framework's lifecycle's unmount method before new `createMap` calls.
* In general, your calls to our `watch` or `subscribe` methods should also be cleaned up to avoid leaks. These methods return `unwatch` or `unsubscribe` methods respectively, and can be called on any cleanup.
* Most frameworks will handle DOM regeneration on rerenders themselves. Should you need to clean up the DOM for arbitrary reasons yourself, this snippet may come in handy:
  ```js
    const polarstern = document.getElementById('polarstern-wrapper')
    const stellamaris = document.createElement('div')
    stellamaris.id = 'polarstern'
    polarstern?.parentElement?.replaceChild(stellamaris, polarstern)
  ```

## Store

The core module features a vuex root store that all plugin vuex modules are plugged into. However, the root contents are only relevant to plugins. It is accessible with `map.$store`, and can be used as a starting point for plugin access.

To ease use, the map instance also features a `subscribe` method that will register a watcher to any state field. Please mind that only documented paths should be used, and all others are subject to change without notice.

```js
// state subscription – listening to data held by the map client
map.subscribe('some/key', (value) => {
  // do something with the value
})

// getter subscription – these are computed values from various sources
map.$store.watch(
    (_, getters) => getters['some/key'],
    (value) => {
        // effect
    }
)
```

This is, for example, useful to listen to search results, draw features, or marker coordinates. The plugins document how exactly to use their respective fields.

To add content to the `MoveHandle`, the mutation `setMoveHandle` can be used. The values needed are described in `@polar/lib-custom-types:MoveHandleProperties`.

### Mutations

#### setOidcToken

```js
map.$store.commit('setOidcToken', 'base64encodedOIDCtoken')
```

Calling the mutation `setOidcToken` adds the given Base64-encoded OIDC token to the store.  
If the configuration parameter `secureServiceUrlRegex` is set, the token will be sent as a Bearer token in the Authorization header of all requests to URLs that match the regular expression.

### Getters

You may desire to listen to whether the loader is currently being shown.

| fieldName | type | description |
| - | - | - |
| map | Map \| null | Returns the openlayers map object. |
| hovered | Feature \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the currently hovered marker. Please mind that it may be a clustered feature. |
| selected | Feature \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the currently selected marker. Please mind that it may be a clustered feature. |
| selectedCoordinates | Array \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the coordinates of the currently selected marker. |

## Special Flags

POLAR uses flags on some OL elements to handle overarching issues. Those flags can be retrieved with `olThing.get('_flagName')`. These flags must not be specific to a plugin and must provide documentation in this place. They may yield uses outside of the POLAR application when further building upon the clients or creating new plugins.

| flagName | type | description |
| - | - | - |
| _isPolarDragLikeInteraction | true | This flag is either `true` or absent. It must be present on drag-like interactions with the map to provide information to the core on when to display the map pan instructions on mobile devices. The instructions will not be shown if a single interaction with this flag is found, assuming that the interaction takes precendence over scrolling the page. |
