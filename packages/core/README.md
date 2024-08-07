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

The exported default object is an extended masterportalAPI, adding the `addPlugins` and extending the `createMap` functions. For masterportalAPI details, [see their repository](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/).

To be able to see the map in production mode, the imported stylesheet has to have the property `data-polar`. The value can be chosen arbitrarily. ⚠️ Deprecated. The new field 'stylePath' should be used instead.

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

If the storeModule features a `setupModule` action, it will be executed automatically after initialization.

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
| layerConf | LayerConf | Layer configuration as required by masterportalAPI. |
| language | enum["de", "en"] | Initial language. |
| <...masterportalAPI.fields> | various | The object is also used to initialize the masterportalAPI. Please refer to their documentation for options. |
| <plugin.fields> | various? | Fields for configuring plugins added with `addPlugins`. Refer to each plugin's documentation for specific fields and options. Global plugin parameters are described [below](#global-plugin-parameters). |
| locales | LanguageOption[]? | All locales in POLAR's plugins can be overridden to fit your needs.|
| vuetify | object? | You may add vuetify configuration here. |
| extendedMasterportalapiMarkers | extendedMasterportalapiMarkers? | Optional. If set, all configured visible vector layers' features can be hovered and selected by mouseover and click respectively. They are available as features in the store. Layers with `clusterDistance` will be clustered to a multi-marker that supports the same features. Please mind that this only works properly if you configure nothing but point marker vector layers styled by the masterportalAPI. |
| stylePath | string? | If no link tag with `data-polar="true"` is found in the document, this path will be used to create the link node in the client itself. It defaults to `'./style.css'`. Please mind that `data-polar="true"` is deprecated since it potentially led to flashes of misstyled content. stylePath will replace that solution in the next major release. |
| renderFaToLightDom | boolean? | POLAR requires FontAwesome in the Light/Root DOM due to an [unfixed bug in many browsers](https://bugs.chromium.org/p/chromium/issues/detail?id=336876). This value defaults to `true`. POLAR will, by default, just add the required CSS by itself. Should you have a version of Fontawesome already included, you can try to set this to `false` to check whether the versions are interoperable. |

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

To figure out the name of the locales to override, inspect the matching plugin in GitHub's file browser. In `packages/plugins`, open the plugin you desire to override. Each plugin's `src` folder contains a `language.ts` listing all used locale keys with appropriate nesting.

##### mapConfiguration.extendedMasterportalapiMarkers

| fieldName | type |description |
| - | - | - |
| layers | string[] | List of layer ids. The effect will only be applied to these layers. |
| defaultStyle | MarkerStyle? | Used as the default marker style. The default fill color for these markers is `'#005CA9'`. |
| hoverStyle | MarkerStyle? | Used as map marker style for hovered features. The default fill color for these markers is `'#7B1045'`. |
| selectionStyle | MarkerStyle? | Used as map marker style for selected features. The default fill color for these markers is `'#679100'`. |
| clusterClickZoom | boolean? | If `true`, clicking a cluster feature will zoom into the clustered features' bounding box (with padding) so that the cluster is "resolved". This happens until the maximum zoom level is reached, at which no further zooming can take place. Defaults to `false`. |
| dispatchOnMapSelect | string[]? | If set, the parameters will be spread to dispatchment on map selection. `['target', 'value']` will `dispatch(...['target', 'value'])`. This can be used to open the iconMenu's GFI with `['plugin/iconMenu/openMenuById', 'gfi']`, should the IconMenu exist and the gfi plugin be in it with this id. |

###### mapConfiguration.extendedMasterportalapiMarkers.MarkerStyle

| fieldName | type |description |
| - | - | - |
| clusterSize | [number, number]? | `width` and `height` of the `<svg>`-cluster-marker. |
| fill | (string \| masterportalapiPolygonFillHatch)? | Fill color (or hatch pattern) for map marker. |
| size | [number, number]? | `width` and `height` of the `<svg>`-marker. |
| strokeWidth | (string \| number)? | Width of marker stroke (outer line). Defaults to `'2'`. |
| stroke | string? | Color of marker stroke (outer line). Defaults to `'#ffffff'`. |

A full documentation of the masterportalapiPolygonFillHatch is available at the Masterportal's documentation file [style.json.md](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md), chapter 'Polygon.polygonFillHatch'. The basic usage is quoted below for quick lookup. For more details, visual examples, and expert features, see there.

>|Name|Required|Type|Default|Description|
>| - | - | - | - | - |
>|pattern|no|enum["diagonal", "diagonal-right", "zig-line", "zig-line-horizontal", "circle", "rectangle", "triangle", "diamond"]/Object|`"diagonal"`|Draw pattern. You may either use a pre-defined pattern from the enum or specify one yourself.|
>|size|no|Number|`30`|Edge length of a singular repeated pattern element.|
>|lineWidth|no|Number|`10`|Line width of drawn pattern. To achieve an even distribution in diagonal and zig-line pattern, choose lineWidth as (1/3 * size). For triangle and diamond, a lineWidth of 1 must be chosen. For rectangle, a lineWidth of at most (1/4 * size) should be chosen. Deviating from these rules is not harmful, but patterns may seem off.|
>|backgroundColor|no|Number[]|`[0, 0, 0, 1]`|Background color of polygon.|
>|patternColor|no|Number[]|`[255, 255, 255, 1]`|Fill color of pattern drawn on polygon.|

##### mapConfiguration.LayerConf

The layer configuration (or: service register) is read by the masterportalAPI. The full definition can be read [here](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/services.json.md).

However, not all listed services have been implemented in the masterportalAPI yet, and no documentation regarding implemented properties exists there yet.

Whitelisted and confirmed parameters include:

- WMS: id, name, url, typ, format, version, transparent, layers, STYLES
- WFS: id, name, url, typ, outputFormat, version, featureType

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
  }
]
```

Since this is the base for many functions, the service ID set in this is used to reference map material in many places of the map client.

##### <...masterportalAPI.fields>

The `<...masterportalAPI.fields>` means that any masterportalAPI field may also be used here _directly_. The most common fields are the following ones; for more, see masterportalAPI.

| fieldName | type | description |
| - | - | - |
| startResolution | number | Initial resolution; must be in options. See below. |
| startCenter | number[] | Initial center coordinate. |
| extent | number[] | Map movement will be restricted to this rectangle. |
| epsg | string | Leading coordinate system, e.g. `"EPSG:25832"`. |
| options | Array | Defines all available zoomLevels. Entries define `resolution`, `scale`, and `zoomLevel`. See masterportalAPI for details. |
| namedProjections | Array | Array of usable projections by proj4 string. |

##### <plugin.fields>

Plugins in POLAR are modular components that extend the functionality of the map client. They can be added using the [addPlugins](#addPlugins) method and configured through the `mapConfiguration` object. Each plugin has its own set of fields and options that can be customized.

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
