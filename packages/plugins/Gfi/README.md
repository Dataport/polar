# GFI

## Scope

The GFI plugin can be used to fetch and optionally display GFI (GetFeatureInfo) from WMS and WFS services as well as layers based on GeoJSON files. In a first step, the information is stored in the VueX store to allow for easy access. Display is optional and quite obstructive within the map client.

> ⚠️ The display feature is currently not meant for production. Please use data bindings for display to avoid obstructing the map client.

### Extension ideas

- To ease the currently rather complex WMS GFI parsing, we may send a WMS
  GetCapabilities request during initialization to detect supported formats by
  services. We may then proceed to choose from the offered formats and have the
  parser ready from the get-go. This would also allow for printing error
  messages for unspecified formats during start-up time, and for choosing a
  better format should the first named (and therefore used by default) format be
  unhandy, e.g. be an arbitrary text response.

- Currently, the specification on how to display a GFI is taken from the
  mapConfiguration object. The Masterportal does support GFI instructions
  specified on the layer definitions within the services.json file itself. That
  specification is documented, but a little more complex, and ignored for now,
  since we're going for a more configurable client – our users will, in general,
  be interested in _one specific layer_, not any layer that might display GFI.

  However, we may still support that one day by e.g. a configuration parameter
  `useServicesDefinition::boolean`.

- Any entry may be a callback rather than an object/definition

- Display links as `<a ...>Click to open</a>`

- Optionally filter to visible layers

- Reduce features to a single window rather
  than showing each feature individually
  - By function parameter
  - By definition

### Configuration

#### gfi

| fieldName            | type                                                                                              | description                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| layers               | Record<string, gfiLayerConfiguration>                                                             | Maps a string (must be a layer ID) to a behaviour configuration for that layer.                                                                                                                                                                                                                                                                                                           |
| coordinateSources    | string[]                                                                                          | The GFI plugin will react to these coordinate positions in the store. This allows it to react to e.g. the address search of the pins plugin. Please see example configuration for the common use-cases. If listening to other plugins, the GFI plugin must be added _after_ that respective plugin.                                                                                       |
| mode                 | enum["bboxDot", "intersects"]                                                                     | Method of calculating which feature has been chosen by the user. `bbodyDot` utilizes the `bbox`-url parameter using the clicked coordinate while `intersects` uses a `Filter` to calculate the intersected features. Layers can have their own `gfiMode` parameter which would override this global mode. To apply this, add the desired value to the parameter in the `mapConfiguration` |
| customHighlightStyle | object                                                                                            | If required a user can change the stroke and fill of the highlighted feature. The default style as seen in the example will be used for each part that is not customized. An empty object will return the complete default style while e.g. for an object without a configured fill the default fill will be applied.                                                                     |
| afterLoadFunction    | function (featuresByLayerId: Record<string, GeoJsonFeature[]>): Record<layerId, GeoJsonFeature[]> | This method can be used to extend, filter, or otherwise modify a GFI result.                                                                                                                                                                                                                                                                                                              |
| gfiContentComponent  | Vue?                                                                                              | Allows overriding the GfiContent.vue component for a custom design. Coding knowledge required to use this feature.                                                                                                                                                                                                                                                                        |

##### gfi.gfiLayerConfiguration

| fieldName      | type                                       | description                                                                                                                                                                                                                                          |
| -------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| window         | boolean                                    | If true, properties will be shown in the map client.                                                                                                                                                                                                 |
| geometry       | boolean                                    | If true, feature geometry will be highlighted within the map.                                                                                                                                                                                        |
| properties     | Record<propertyName, displayName>/string[] | In case `window` is `true`, this will be used to determine which contents to show. In case of an array, keys are used to select properties. In case of an object, keys are used to select properties, but will be titles as their respective values. |
| renderType | ('iconMenu' \| 'independent')? | Only relevant if `window` is set to `true`. Whether the gfi plugin is independently or as part of the IconMenu. Defaults to 'independent'. |
| featureList | featureList? | If defined, a list of available vector layer features is visible when no feature is selected. |
| exportProperty | string                                     | Property of the features of a service having an url usable to trigger a download of features as a document.                                                                                                                                          |

##### gfi.customHighlightStyle

| fieldName | type   | description                          |
| --------- | ------ | ------------------------------------ |
| stroke    | object | Object for defining the stroke style |
| fill      | object | Object for defining the fill style   |

##### gfi.customHighlightStyle.stroke

| fieldName | type   | description  |
| --------- | ------ | ------------ |
| color     | string | Color value  |
| width     | number | Stroke width |

##### gfi.customHighlightStyle.fill

| fieldName | type   | description |
| --------- | ------ | ----------- |
| color     | string | Color value |

##### gfi.featureList

| fieldName | type | description |
| - | - | - |
| layers | string[] | A non-empty list of vector layer to list features of. |
| mode | 'visible' \| 'known' | Whether to show only features currently visible in the map view's bounding box or to display all known features. In the latter case, if you desire to display all features of a layer (seen or not), set its loading strategy to `'all'`. |
| pageLength | number? | A number >0 that sets the limit to the feature list's length. If the length is surpassed, additional features can be reached by using the pagination that is generated in such a case. If not defined, the list can be of arbitrary length. |

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

### Getters

If a successful query has been sent and a response has been received, the result will be saved in the store and can be subscribed through the path `'plugin/gfi/featureInformation'`. If, however, a query for a layer fails, a `Symbol` containing the error will be saved in the store instead to indicate the error.

The exact value of `featureInformation` may vary wildly depending on the service used, but is always given as json representation here.

```js
map.subscribe('plugin/gfi/featureInformation', (featureInformation) => {
  /* Your code here */
})
```
