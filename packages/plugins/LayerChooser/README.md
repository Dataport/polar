# LayerChooser

The tool offers layer selection to the user.

## Scope

The LayerChooser offers an additive (usually Overlays, technically named with `type: 'mask'`) and an exclusive (usually background maps, `type: 'background'`) selection of layers to the users.

Order of layers within a layer is currently always as initially configured.

## Configuration

The tool does not require any configuration for itself, but is based on the `mapConfiguration.layers` array. It will infer its options from there, and change layer visibility and availability depending on `minZoom` and `maxZoom`.

Each object in `mapConfiguration.layers` array fits this definition:

| fieldName | type | description |
| ---------- | -------------------------- | -------------------------------------------------------------------------------------- |
| id | string | Service register id. |
| name | string | Display name in UI. |
| type | enum["background", "mask"] | Layer handling. Backgrounds are mutually exclusive, masks ("overlays") can be stacked. |
| hideInMenu | boolean? | Can be set for layers of type `'mask'` to hide them in the selection menu. |
| maxZoom | number? | If set, layer only available (and selectable) to this zoom level. |
| minZoom | number? | If set, layer only available (and selectable) from this zoom level on. |
| options | options? | Shows a layer-specific sub-menu; its contents are configurable. |
| visibility | boolean? | Initial visibility. Defaults to `false`. |

### mapConfiguration.layers.options

An option wheel will appear in the layer chooser that allows opening a sub-menu with configured configuration options for the end user.

| fieldName | type | description |
| --------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| layers | options.layers | If configured, all configured _layers of the layer_ can be turned off and on by the user. ⚠️ Only implemented for WMS. Only implemented for top layers; that is, only first level of nesting is considered. |

#### mapConfiguration.layers.options.layers

This field is named like this to match the OGC specification for their name; that is, layers have layers that may have layers that may have layers, and so on. However, only the first level (a layer's layers) is currently implemented.

| fieldName | type | description |
| --------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| legend | boolean \| Record<name, legendUrl>? | Legend image to be used for sub-layer. If false, no image is displayed. If true, it is assumed an image exists in the layer's GetCapabilities, and that will be used. If Record, it maps the layer name to a linked image. The `legendUrl` can be any valid reachable image URL. |
| order | string? | Optional. If not given, field `layers` from service description will be used, and defines order of options. If layer defined in service description's `layers` and `order`, it's initially on. If only in `order`, it's initially off. If only in `layers`, it's always-on. If in neither, it's always-off. |
| title | boolean \| Record<name, layerName>? | Title to be displayed for sub-layer. If false, layer name itself will be used as given in service description 'layers' field. If true, it is assumed a name exists in the layer's GetCapabilities, and that will be used. If Record, it maps the layer name to an arbitrary display name given by the configuration. The `layerName` can be any string. |
