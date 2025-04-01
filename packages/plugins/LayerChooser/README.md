# LayerChooser

The tool offers layer selection to the user.

## Scope

The LayerChooser offers an additive (usually Overlays, technically named with `type: 'mask'`) and an exclusive (usually background maps, `type: 'background'`) selection of layers to the users.

Order of layers within a layer is currently always as initially configured.

## Configuration

The tool does not require any configuration for itself (for configuration options see further below), but is based on the [`mapConfiguration.layers`](../../core/README.md#mapconfiguration.layers).
It will infer `id` and `name` from that configuration.

This plugin requires the configuration of `mapConfiguration.layer.type`.
Also, this plugin also supports the optional configuration parameters `mapConfiguration.layer.hideInMenu`, `mapConfiguration.layer.minZoom`, `mapConfiguration.layer.maxZoom`, `mapConfiguration.layer.options` and `mapConfiguration.layer.visibility` which are described in more depth in the following table.

| fieldName | type | description |
| - | - | - |
| type | 'background' \| string | Layer handling. If set to `'background'`, the layers are mutually exclusive. All other layers are considered "overlays" and can be stacked. For the type `'mask'` locales are already implemented. For any additional type, these have to be added per client. |
| hideInMenu | boolean? | Can be set for layers of type `'mask'` to hide them in the selection menu. |
| maxZoom | number? | If set, layer only available (and selectable) up to this zoom level, inclusively. |
| minZoom | number? | If set, layer only available (and selectable) from this zoom level on, inclusively. |
| options | options? | Shows a layer-specific sub-menu; its contents are configurable. |
| visibility | boolean? | Initial visibility. Defaults to `false`. |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

**Example configuration:**

```js
layers: [
  {
    id: backgroundmap,
    visibility: true,
    type: 'background',
    name: 'Basemap Grayscale',
  },
  {
    id: memorialsWFS,
    visibility: false,
    hideInMenu: true,
    type: 'mask',
    name: 'Memorial (WFS)',
    minZoom: 7,
  },
]
```

### layerChooser

| fieldName | type| description |
| - | - | - |
| component | VueConstructor? | Allows overriding the LayerChooser.vue component for custom design and functionality. Coding knowledge is required to use this feature, as any implementation will have to rely upon the VueX store model. Please refer to the implementation. |

### layer.options

An option wheel will appear in the layer chooser that allows opening a sub-menu with configured configuration options for the end user.

| fieldName | type | description |
| - | - | - |
| layers | layer.options.layers | If configured, all configured _layers of the layer_ can be turned off and on by the user. ⚠️ Only implemented for WMS. Only implemented for top layers; that is, only first level of nesting is considered. |

Example configuration:
```js
options: {
  layers: {
    order: '6,24,25,4,3,2,1,0',
    title: {
      '6': 'Monument area',
      '24': 'Majority of structures',
      '25': 'Material group',
      '4': 'Architectural monument',
      '3': 'Natural monument',
      '2': 'Water bodies',
      '1': 'Architectural monument (area)',
      '0': 'Natural monument (area)',
    },
    legend: true,
  },
},
```

#### layer.options.layers

This field is named like this to match the OGC specification for their name; that is, layers have layers that may have layers that may have layers, and so on. However, only the first level (a layer's layers) is currently implemented.

| fieldName | type | description |
| - | - | - |
| legend | boolean \| Record<name, legendUrl>? | Legend image to be used for sub-layer. If false, no image is displayed. If true, it is assumed an image exists in the layer's GetCapabilities, and that will be used. If Record, it maps the layer name to a linked image. The `legendUrl` can be any valid reachable image URL. |
| order | string? | Optional. If not given, field `layers` from service description will be used, and defines order of options. If layer defined in service description's `layers` and `order`, it's initially on. If only in `order`, it's initially off. If only in `layers`, it's always-on. If in neither, it's always-off. |
| title | boolean \| Record<name, layerName>? | Title to be displayed for sub-layer. If false, layer name itself will be used as given in service description 'layers' field. If true, it is assumed a name exists in the layer's GetCapabilities, and that will be used. If Record, it maps the layer name to an arbitrary display name given by the configuration. The `layerName` can be any string. |

Example configuration:
```js
layers: {
  order: '6,24,25,4,3,2,1,0',
  title: {
    '6': 'Monument area',
    '24': 'Majority of structures',
    '25': 'Material group',
    '4': 'Architectural monument',
    '3': 'Natural monument',
    '2': 'Water bodies',
    '1': 'Architectural monument (area)',
    '0': 'Natural monument (area)',
  },
  legend: true,
},
```
