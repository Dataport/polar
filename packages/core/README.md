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

### addPlugins

Before instantiating the map, all required plugins have to be added. Depending on how you use POLAR, this may already have been done. Ready-made clients (that is, packages prefixed `@polar/client-`) come with plugins prepared. You may add further plugins or proceed with `createMap`.

In case you're integrating new plugins, call `addPlugins` with an array of instances.

```js
client.addPlugins([Plugin({ pluginConfig })])
```

In case you're writing a new plugin, it must fulfill the following API:

```js
const Plugin = (options: PluginOptions) => (instance: Vue) =>
  instance.$store.dispatch('addComponent', {
    name: 'plugin', // unique technical name
    plugin: Plugin, // a vue component
    language, // an i18n locale batch
    options, // configuration; overriddable with mapConfiguration on createMap
    storeModule, // vuex store module, if required
  })
```

Please note that the order of certain plugins is relevant when other plugins are referenced, e.g. `@polar/plugin-gfi`'s `coordinateSources` requires the sources to have previously been set up.

Please note that all configuration added via plugin constructors can be overridden in the `createMap`'s parameter `mapConfiguration`. You may use either object (or a mix of them) to create the configuration, e.g. use the constructors for a base configuration and the `mapConfiguration` object to override it for various use cases.

How exactly you do this is up to you and influences the minimum API call requirements your client has.

If the storeModule features a `setupModule` action, it will be executed automatically after initialization.

### initializeLayerList

Layers intended to be used in the map have to be initialized by calling `initializeLayerList` with a service register.  
This register may either be a link to a predefined service register like [the Hamburg service register](https://geodienste.hamburg.de/services-internet.json), or the custom service register that is also used in [mapConfiguration.layerConf](#mapconfigurationlayerconf).

```js
core.rawLayerList.initializeLayerList(services: mapConfiguration.layerConf | string, callback?: Function)
```

[createMap](#createmap) is usually called inside the callback or directly after this function call.  

### createMap

The map is created by calling the `createMap` method. Depending on how you use POLAR, this may already have been done, as some clients come as ready-made standalone HTML pages that do this for you.

```js
MapClient.createMap({
  // arbitrary id, must point to a div
  containerId: 'polarstern',
  // see below
  mapConfiguration,
}).then((map) => {
  /* Your Code, e.g. for setting up callbacks. */
})
```

#### mapConfiguration

The mapConfiguration allows controlling many client instance details.

| fieldName | type | description |
| - | - | - |
| <...masterportalapi.fields> | various | Multiple different parameters are required by the masterportalapi to be able to create the map. Also, some fields are optional but relevant and thus described here as well. For all additional options, refer to the documentation of the masterportalapi itself. |
| checkServiceAvailability | boolean? | If set to `true`, all services' availability will be checked with head requests. |
| extendedMasterportalapiMarkers | extendedMasterportalapiMarkers? | Optional. If set, all configured visible vector layers' features can be hovered and selected by mouseover and click respectively. They are available as features in the store. Layers with `clusterDistance` will be clustered to a multi-marker that supports the same features. Please mind that this only works properly if you configure nothing but point marker vector layers styled by the masterportalapi. |
| featureStyles | string? | Optional path to define styles for vector features. See `mapConfiguration.featureStyles` for more information. May be a url or a path on the local file system. |
| language | enum["de", "en"]? | Initial language. |
| locales | LanguageOption[]? | All locales in POLAR's plugins can be overridden to fit your needs.|
| <plugin.fields> | various? | Fields for configuring plugins added with `addPlugins`. Refer to each plugin's documentation for specific fields and options. Global plugin parameters are described [below](#global-plugin-parameters). |
| renderFaToLightDom | boolean? | POLAR requires FontAwesome in the Light/Root DOM due to an [unfixed bug in many browsers](https://bugs.chromium.org/p/chromium/issues/detail?id=336876). This value defaults to `true`. POLAR will, by default, just add the required CSS by itself. Should you have a version of Fontawesome already included, you can try to set this to `false` to check whether the versions are interoperable. |
| stylePath | string? | This path will be used to create the link node in the client itself. It defaults to `'./style.css'`. |
| vuetify | object? | You may add vuetify configuration here. |

<details>
<summary>Example configuration</summary>

```ts
import locales from './locales'

const mapConfiguration = {
  stylePath: '../dist/polar-client.css',
  checkServiceAvailability: true,
  language: 'de',
  locales, // the languageOptions object will normally be outsourced to another file
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

##### mapConfiguration.LanguageOption

A language option is an object consisting of a type (its language key) and the i18next resource definition. You may e.g. decide that the texts offered in the LayerChooser do not fit the style of your client, or that they could be more precise in your situation since you're only using *very specific* overlays.

An example for a LanguageOption array usable in `createMap` is this array:

```ts
const languageOptions: LanguageOption[] = [
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

The `<...masterportalapi.fields>` means that any masterportalapi field may also be used here _directly_ in the mapConfiguration. The fields described here are fields that are interesting for the usage of POLAR.
Fields that are not set as required have default values.

| fieldName | type | description |
| - | - | - |
| layerConf | layerConf | Layer configuration of all available layers as a service register. Layers defined here are not directly shown in a client, see `mapconfiguration.layers` for that. |
| layers | layer[] | Configuration of layers that are supposed to be used in the respective client. All layers defined here have to have an entry in `mapConfiguration.layerConf`. If `@polar/plugin-layer-chooser` is installed and configured, all these layers will be displayed in that menu. |
| startCenter | number[] | Initial center coordinate. Needs to be defined in the chosen leading coordinate system. |
| epsg | `EPSG:${string}`? | Leading coordinate system. The coordinate system has to be defined in `mapConfiguration.namedProjections` as well. Changing this value should also lead to changes in `mapConfiguration.startCenter`, `mapConfiguration.extent`, `mapConfiguration.options` and `mapConfiguration.startResolution` as they are described in or related to the leading coordinate system. Defaults to `'EPSG:25832'`. |
| extent | number[]? | Map movement will be restricted to the rectangle described by the given coordinates. Unrestricted by default. |
| namedProjections | Array<[string,string]>? | Array of usable coordinated systems mapped to a projection as a proj4 string. Defines `'EPSG:25832'`, `'EPSG:3857'`, `'EPSG:4326'`, `'EPSG:31467'` and `'EPSG:4647'` by default. If you set a value, please mind that all pre-configured projections are overridden, and requiring e.g. `'EPSG:4326'` will only work if it is also defined in your override. |
| options | zoomOption[]? | Defines all available zoom levels mapped to the respective resolution and related scale. Defines 10 zoomLevels for `'EPSG:25832'` by default. |
| startResolution | number? | Initial resolution; must be described in `mapConfiguration.options`. Defaults to `15.874991427504629` which is zoom level to in the default of `mapConfiguration.options`. |

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

The layer configuration (or: service register) is read by the `@masterportal/masterportalapi`. The full definition can be read [here](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md).

However, not all listed services have been implemented in the `@masterportal/masterportalapi` yet, and no documentation regarding implemented properties exists there yet.

Whitelisted and confirmed parameters include:

- WMS:  id, name, url, typ, format, version, transparent, layers, STYLES
- WFS:  id, name, url, typ, outputFormat, version, featureType
- WMTS: id, name, urls, typ, capabilitiesUrl, optionsFromCapabilities, tileMatrixSet, layers, legendURL, format, coordinateSystem, origin, transparent, tileSize, minScale, maxScale, requestEncoding, resLength
- GeoJSON: id, name, url, typ, version, minScale, maxScale, legendURL

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

###### zoomOption

| fieldName | type | description |
| - | - | - |
| resolution | number | Size of 1 pixel on the screen converted to map units (e.g. meters) depending on the used projection (`epsg`). |
| scale | number | Scale in meters. |
| zoomLevel | number | Zoom level. |

##### layer

| fieldName | type | description |
| - | - | - |
| id | string | Service register id in `mapConfiguration.layerConf`. |
| name | string | Display name in UI. |
| styleId | string? | Id of the used style. May lead to unexpected results if the layer is also configured to be used with `mapConfiguration.extendedMasterportalapiMarkers`. Only applicable for vector-type layers. For more information and an example see `mapConfiguration.featureStyles`. Defaults and fallbacks to OpenLayers default styling. |

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


##### mapConfiguration.vuetify

These fields let you e.g. specify a [Vuetify-Theme](https://vuetifyjs.com/en/features/theme/). For more options, refer to the official vuetify documentation.

Additionally to the regular fields, `primaryContrast` and `secondaryContrast` are interpreted. They serve as contrast colors to their respective fields and are used for e.g. button icons.

```js
{
  theme: {
    themes: {
      light: {
        primary: "black",
        primaryContrast: "white",
        secondary: "#c0ffee",
        secondaryContrast: "#de1e7e"
      }
    }
  }
}
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

### Getters

You may desire to listen to whether the loader is currently being shown.

| fieldName | type | description |
| - | - | - |
| map | Map \| null | Returns the openlayers map object. |
| hovered | Feature \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the currently hovered marker. Please mind that it may be a clustered feature. |
| selected | Feature \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the currently selected marker. Please mind that it may be a clustered feature. |
| selectedCoordinates | Array \| null | If `useExtendedMasterportalApiMarkers` is active, this will return the coordinates of the currently selected marker. |