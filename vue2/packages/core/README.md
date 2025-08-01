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

##### mapConfiguration.Locale

An example for a Locale array usable in `createMap` is this array:

```ts
const locales: Locale[] = [
  {
    type: 'de',
    resources: {
      plugins: {
        layerChooser: {
          maskTitle: 'Bahnstrecken',
        },
      },
    },
  },
  {
    type: 'en',
    resources: {
      plugins: {
        layerChooser: {
          maskTitle: 'Railway lines',
        },
      },
    },
  },
]
```

To figure out the name of overridable locales, inspect the documentation of your client; [for example, this is the documentation page of the snowbox](https://dataport.github.io/polar/docs/snowbox/client-snowbox.html). All child documents with locales feature a table of default translations at the end, and some clients bring their own locales and pre-existing overrides.

When reading the locale tables, please mind that the dot notation (`a.b.c | value`) has to be written as separate keys in nested objects as seen in the example above (`{a: {b: {c: "value"}}}`).

##### mapConfiguration.extendedMasterportalapiMarkers

| fieldName | type |description |
| - | - | - |
| layers | string[] | List of layer ids. The effect will only be applied to these layers. |
| clusterClickZoom | boolean? | If `true`, clicking a cluster feature will zoom into the clustered features' bounding box (with padding) so that the cluster is "resolved". This happens until the maximum zoom level is reached, at which no further zooming can take place. Defaults to `false`. |
| defaultStyle | MarkerStyle? | Used as the default marker style. The default fill color for these markers is `'#005CA9'`. |
| dispatchOnMapSelect | [string, unknown]? | If set, the parameters will be spread to dispatchment on map selection. `['target', 'value']` will `dispatch(...['target', 'value'])`. This can be used to open the iconMenu's GFI with `['plugin/iconMenu/openMenuById', 'gfi']`, should the IconMenu exist and the gfi plugin be in it with this id. |
| hoverStyle | MarkerStyle? | Used as map marker style for hovered features. The default fill color for these markers is `'#7B1045'`. |
| isSelectable | ((feature: GeoJsonFeature) => boolean)? | If undefined, all features are selectable. If defined, this can be used to sort out features to be unselectable, and such features will be styled different and won't react on click. |
| selectionStyle | MarkerStyle? | Used as map marker style for selected features. The default fill color for these markers is `'#679100'`. |
| unselectableStyle | MarkerStyle? | Used as a map marker style for unselectable features. Features are unselectable if a given `isSelectable` method returns falsy for a feature. The default fill color for these markers is `'#333333'`. |

Example configuration:
```js
extendedMasterportalapiMarkers: {
  layers: ['reportServiceLayerId'],
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
  unselectableStyle: {
    stroke: '#FFFFFF',
    fill: '#333333'
  },
  isSelectable: (feature: Feature) => feature.get('indicator')
  clusterClickZoom: true,
  dispatchOnMapSelect: ['plugin/iconMenu/openMenuById', 'gfi'],
},
```

###### mapConfiguration.extendedMasterportalapiMarkers.MarkerStyle

| fieldName | type |description |
| - | - | - |
| clusterSize | [number, number]? | `width` and `height` of the `<svg>`-cluster-marker. |
| fill | (string \| masterportalapiPolygonFillHatch)? | Fill color (or hatch pattern) for map marker. |
| size | [number, number]? | `width` and `height` of the `<svg>`-marker. |
| stroke | string? | Color of marker stroke (outer line). Defaults to `'#ffffff'`. |
| strokeWidth | (string \| number)? | Width of marker stroke (outer line). Defaults to `'2'`. |

Example configuration:
```js
defaultStyle: {
  stroke: '#FFFFFF',
  fill: '#005CA9',
},
```

A full documentation of the masterportalapiPolygonFillHatch is available at the Masterportal's documentation file [style.json.md](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md), chapter 'Polygon.polygonFillHatch'. The basic usage is quoted below for quick lookup. For more details, visual examples, and expert features, see there.

>|Name|Required|Type|Default|Description|
>| - | - | - | - | - |
>|backgroundColor|no|Number[]|`[0, 0, 0, 1]`|Background color of polygon.|
>|lineWidth|no|Number|`10`|Line width of drawn pattern. To achieve an even distribution in diagonal and zig-line pattern, choose lineWidth as (1/3 * size). For triangle and diamond, a lineWidth of 1 must be chosen. For rectangle, a lineWidth of at most (1/4 * size) should be chosen. Deviating from these rules is not harmful, but patterns may seem off.|
>|pattern|no|enum["diagonal", "diagonal-right", "zig-line", "zig-line-horizontal", "circle", "rectangle", "triangle", "diamond"]/Object|`"diagonal"`|Draw pattern. You may either use a pre-defined pattern from the enum or specify one yourself.|
>|patternColor|no|Number[]|`[255, 255, 255, 1]`|Fill color of pattern drawn on polygon.|
>|size|no|Number|`30`|Edge length of a singular repeated pattern element.|

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

##### <...masterportalapi.fields>

<details>
<summary>Example configuration</summary>

```js
{
  startResolution: 264.583190458,
  startCenter: [553655.72, 6004479.25],
  extent: [426205.6233, 5913461.9593, 650128.6567, 6101486.8776],
  epsg: 'EPSG:25832',
  options: [
    { resolution: 66.14579761460263, scale: 250000, zoomLevel: 0 },
    { resolution: 26.458319045841044, scale: 100000, zoomLevel: 1 },
    { resolution: 15.874991427504629, scale: 60000, zoomLevel: 2 },
    { resolution: 10.583327618336419, scale: 40000, zoomLevel: 3 },
    { resolution: 5.2916638091682096, scale: 20000, zoomLevel: 4 },
    { resolution: 2.6458319045841048, scale: 10000, zoomLevel: 5 },
    { resolution: 1.3229159522920524, scale: 5000, zoomLevel: 6 },
    { resolution: 0.6614579761460262, scale: 2500, zoomLevel: 7 },
    { resolution: 0.2645831904584105, scale: 1000, zoomLevel: 8 },
    { resolution: 0.1322915952292052, scale: 500, zoomLevel: 9 },
  ],
  namedProjections: [
    [
      'EPSG:25832',
      '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    ],
  ],
}
```

</details>

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

##### layer

<details>
<summary>Example configuration</summary>

```js
layers: [
  {
    id: 'basemap',
    name: 'Basemap Grayscale',
  },
  {
    id: 'my-wfs',
    name: 'My WFS service',
  },
]
```

</details>

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
