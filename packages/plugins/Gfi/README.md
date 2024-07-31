# GFI

## Scope

The GFI plugin can be used to fetch and optionally display GFI (GetFeatureInfo) from WMS and WFS services as well as layers based on GeoJSON files. In a first step, the information is stored in the VueX store to allow for easy access. Display is optional and quite obstructive within the map client.

> ⚠️ The display feature is currently not meant for production. Please use data bindings for display to avoid obstructing the map client.

### Configuration

#### gfi

| fieldName | type | description |
| - | - | - |
| coordinateSources | string[] | The GFI plugin will react to these coordinate positions in the store. This allows it to react to e.g. the address search of the pins plugin. Please see example configuration for the common use-cases. Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one. |
| layers | Record<string, gfiLayerConfiguration> | Maps a string (must be a layer ID) to a behaviour configuration for that layer. |
| activeLayerPath | string? | Optional store path to array of active mask layer ids. If used with `LayerChooser`, setting this to `'plugin/layerChooser/activeMaskIds'` will result in an info text in the GFI box, should no layer be active. If used without `LayerChooser`, the active mask layers have to be provided by another plugin or the client. If not set, the GFI plugin may e.g. show an empty list, which may be confusing to some users. |
| afterLoadFunction | function (featuresByLayerId: Record<string, GeoJsonFeature[]>): Record<layerId, GeoJsonFeature[]>? | This method can be used to extend, filter, or otherwise modify a GFI result. |
| customHighlightStyle | customHighlighStyle? | If required a user can change the stroke and fill of the highlighted feature. The default style as seen in the example will be used for each part that is not customized. An empty object will return the complete default style while e.g. for an object without a configured fill the default fill will be applied. |
| featureList | featureList? | If defined, a list of available vector layer features is visible when no feature is selected. Only usable if `renderType` is set to `iconMenu` and `window` is set to `true` for at least one configured layer. |
| gfiContentComponent | Vue? | Allows overriding the GfiContent.vue component for a custom design. Coding knowledge required to use this feature. |
| maxFeatures | number? | Limits the viewable GFIs per layer by this number. The first n elements are chosen arbitrarily. Useful if you e.g. just want one result, or to limit an endless stream of returns to e.g. 10. Infinite by default. |
| mode | enum["bboxDot", "intersects"]? | Method of calculating which feature has been chosen by the user. `bboxDot` utilizes the `bbox`-url parameter using the clicked coordinate while `intersects` uses a `Filter` to calculate the intersected features. Layers can have their own `gfiMode` parameter which would override this global mode. To apply this, add the desired value to the parameter in the `mapConfiguration`. Defaults to `'bboxDot'`. |
| renderType | ('iconMenu' \| 'independent')? | Only relevant if `window` is set to `true` for at least one layer. Whether the gfi plugin is rendered independently or as part of the IconMenu. Defaults to 'independent'. |

##### gfi.gfiLayerConfiguration

| fieldName | type | description |
| - | - | - |
| exportProperty | string? | Property of the features of a service having an url usable to trigger a download of features as a document. |
| geometry | boolean? | If true, feature geometry will be highlighted within the map. Defaults to `false`. |
| geometryName | string? | Name of the geometry property if not the default field. |
| properties | Record<propertyName, displayName>/string[] | In case `window` is `true`, this will be used to determine which contents to show. In case of an array, keys are used to select properties. In case of an object, keys are used to select properties, but will be titles as their respective values. Displays all properties by default. |
| showTooltip | ((feature: Feature) => [string, string][])? | If given, a tooltip will be shown with the values calculated for the feature. The first string is the HTML tag to render, the second its contents; contants may be locale keys. For more information regarding the strings, see the documentation of the `@polar/lib-tooltip` package. Defaults to `undefined`. Please mind that tooltips will only be shown if a mouse is used or the hovering device could not be detected. Touch and pen interactions do not open tooltips since they will open the GFI window, rendering the gatherable information redundant. |
| window | boolean? | If true, properties will be shown in the map client. Defaults to `false`. |

Additionally, if using a WMS service, the following properties can be configured as well.

| fieldName | type | description |
| - | - | - |
| filterBy | 'clickPosition'? | Some WMS services may return features close to the clicked position. By setting the this value `clickPosition`, only features that intersect the clicked position are shown to the user. Defaults to showing all features. |
| format | 'GML' \| 'GML2' \| 'GML3' \| 'GML32' \| 'text'? | If the `infoFormat` is not set to `'application/geojson'`´, this can be configured to be the known file format of the response. If not given, the format is parsed from the response data. |

##### gfi.customHighlightStyle

| fieldName | type | description |
| - | - | - |
| fill | ol/style/Fill? | Object for defining the fill style. See [OpenLayers documentation](https://openlayers.org/en/latest/apidoc/module-ol_style_Fill-Fill.html) for full options. |
| stroke | ol/style/Stroke? | Object for defining the stroke style. See [OpenLayers documentation](https://openlayers.org/en/latest/apidoc/module-ol_style_Stroke-Stroke.html) for full options. |

##### gfi.featureList

| fieldName | type | description |
| - | - | - |
| mode | 'visible' \| 'loaded' | Whether to show only features currently visible in the map view's bounding box or to display all loaded features. In the latter case, if you desire to display all features of a layer (seen or not), set its loading strategy to `'all'`. |
| bindWithCoreHoverSelect | boolean? | If `true`, the hover/select fields in the core's state will be listened to and interacted with. This will result in a bilateral hovering and selecting of features with the core. Defaults to `false`. |
| pageLength | number? | A number >0 that sets the limit to the feature list's length. If the length is surpassed, additional features can be reached by using the pagination that is generated in such a case. If not defined, the list can be of arbitrary length. |
| text | (function \| string)[]? | Array of one to three entries that will produce title, subtitle, and an additional subtitle for the list view. If string, the text item will simply be that feature's value for the denoted property. If function, it's assumed to match the function signature `(feature: OpenLayersFeature): string`, and the returned string will be used for the text item. |

#### Example configuration

```js
layers: {
  [serviceId]: {
    geometry: true,
    window: false,
    properties: {
      keyInService: 'Display Label'
    } // or ['keyInService'], in which case 'keyInService' is also the actual label
  },
},
coordinateSources: [
  // use coordinates from pins plugin, that is, resolve GFI to pin position
  'plugin/pins/transformedCoordinate',
  'plugin/pins/coordinatesAfterDrag'
],
customHighlightStyle: {
  stroke: {
    color: '#FFFF00',
    width: 3,
  },
  fill: {
    color: 'rgb(255, 255, 255, 0.7)',
  },
},
```

## Store

### State

If a successful query has been sent and a response has been received, the result will be saved in the store and can be subscribed through the path `'plugin/gfi/featureInformation'`. If, however, a query for a layer fails, a `Symbol` containing the error will be saved in the store instead to indicate the error.

The exact value of `featureInformation` may vary wildly depending on the service used, but is always given as json representation here.

```js
map.subscribe('plugin/gfi/featureInformation', (featureInformation) => {
  /* Your code here */
})
```
