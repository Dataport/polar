# Draw

## Scope

The draw plugin allows users to draw features on the map. Drawn features may be edited and deleted.

Currently supported OpenLayers geometry types:

- `'Circle''`
- `'LineString'`
- `'Point'`
- `'Polygon'`

Also, `'Text'` is supported which is modeled as an OpenLayers `'Point'`. This is no default feature, so it must be specified in the configuration to use it.

## User instructions for Text Mode

The interaction with text features is not intuitive, which is why the text feature should come with instructions for the users:

### Edit

To edit the text or the placement of the text feature, the user must click on the center of the text to select the point geometry below it. After selecting it, the user can move the point by keeping the left mouse button pressed, or edit the text in the input field that opens with selecting the feature. If more than one text size is specified in the configuration, the user can change the text size with a slider.

### Delete

To delete the text, the user must either click on the point at the center of the text or use CTRL + left mouse button to open a box over all features that he or she wants to delete.

## Configuration

The styling of the drawn features can be configured to overwrite the default ol-style. Configuration is oriented around the [OpenLayers styles](https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html#~StyleLike).

### draw

| fieldName | type | description |
| - | - | - |
| addLoading | string? | Expects the path to a mutation within the store. This mutation is committed with a plugin-specific loading key as payload when starting asynchronous procedures that are intended to be communicated to the user. |
| enableOptions | boolean? | If `true`, draw options are displayed, like choosing and changing stroke color. Not available for texts features. Defaults to `false`. |
| lassos | lasso[]? | Allows configuring lasso options. The lasso function allows free-hand drawing a geometry on the map; features completely fitting into that geometry will be copied up to the draw layer from all configured layers. UI-wise, it is not intuitive for users do understand what a "Lasso" does. This feature currently requires further instructions by the outlying UI on what one is supposed to do with it. |
| removeLoading | string? | Expects the path to a mutation within the store. This mutation is committed with a plugin-specific loading key as payload when finishing asynchronous procedures that are intended to be communicated to the user. |
| measureOptions | measureOptions? | If set, an additional radio is being shown to the user to be able to let the (then) drawn features display their length and / or area. See [draw.measureOptions](#drawmeasureoptions) for further information. Not shown by default. |
| selectableDrawModes | string[]? | List 'Point', 'LineString', 'Circle', 'Text' and/or 'Polygon' as desired. All besides 'Text' are selectable by default. |
| snapTo | string[]? | Accepts an array of layer IDs. If these layers are active, they are used as snapping material for geometry manipulation. The Draw layer will also always snap to its own features regardless. Please mind that used layers must provide vector data. The layers referred to must be configured in `mapConfiguration.layers`. |
| style | style? | Please see example below for styling options. Defaults to standard OpenLayers styling. |
| textStyle | textStyle? | Use this object with properties 'font' and 'textColor' to style text feature. |
| toastAction | string? | This string will be used as action to send a toast information to the user to clarify why something happened in edge cases. If this is not defined, the information will only be printed to the console for debugging purposes instead. |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

<details>
<summary>Example configuration</summary>

```js
draw: {
  selectableDrawModes: ['Circle', 'LineString', 'Point', 'Polygon', 'Text'],
  textStyle: {
    font: {
      size: [10, 20, 30],
      family: 'Arial',
    },
  },
  style: {
    fill: {
      color: 'rgba(255, 255, 255, 0.5)'
    },
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
```

</details>

#### draw.lasso

| fieldName | type | description |
| - | - | - |
| id | string | The layer id of a vector layer to copy up vector features from. |
| minZoom | boolean | Defaults to `true`. If a boolean is given, the `minZoom` (if configured) of the `LayerConfiguration` in `mapConfiguration.layers` will be adhered to when copying up geometries from the source. This is to prevent the client from overly burdening feature-rich vector services on accident. |

#### draw.measureOptions

| fieldName | type | description |
| - | - | - |
| metres | boolean? | Whether to show the measure option `'m / m²'` to the user. `false` by default. |
| kilometres | boolean? | Whether to show the measure option `'km / km²'` to the user. `false` by default. |
| hectares | boolean? | Whether to show the measure option `'km / ha‚'` to the user. `false` by default. |
| initialOption | 'none' \| 'meters' \| 'kilometres' \| 'hectares' | The initial measure option to be selected. Defaults to `'none'`. |

#### draw.textStyle

| fieldName | type | description |
| - | - | - |
| font | object \| string | Style the font of the text feature with either css font properties or use font as an object with properties 'size' and 'family'. |
| textColor | string? | Define text color in hex or rgb / rgba code. |

Example configuration:
```js
textStyle: {
  font: '16px sans-serif'
  textColor: '#e51313'
}
```

##### draw.textStyle.font

| fieldName | type | description |
| - | - | - |
| family | string? | Font family. |
| size | number[]? | Array with numbers that define the available text sizes that a user can choose from |

Example configuration:
```js
font: {
  size: [10.5, 20, 30.5, 35],
  family: 'serif'
},
```

#### draw.style (by example)

The `@masterportal/masterportalapi` has vectorStyles in development. As soon as that's done, we shall use its styling syntax and methods.

For the time being, please use this example as a rough reference as to what can currently be done.

```js
{
  draw: {
    enableOptions: true,
    style: {
      fill: {
        color: 'rgba(255, 255, 255, 0.5)'
      },
      stroke: {
        color: '#e51313',
        width: 2
      },
      circle: {
        radius: 7,
        fillColor: '#e51313'
      },
      // Styling for text of measurements; supports everything described at https://openlayers.org/en/v9.2.4/apidoc/module-ol_style_Text-Text.html
      measure: {
        font: '16px sans-serif',
        placement: 'line',
        fill: new Fill({ color: 'black' }),
        stroke: new Stroke({ color: 'black' }),
        offsetY: -5
      }
    }
  }
}
```

## Store

### State

```js
map.subscribe('plugin/draw/featureCollection', (featureCollection) => {
  /* Your code. */
})
```

The returned featureCollection is a [GeoJSON](https://geojson.org/) FeatureCollection. It includes all drawn features (including possible measurements in meters with two decimals precision) and updates on changes.

### Actions

#### addFeatures

```js
map.$store.dispatch('plugin/draw/addFeatures', {
  geoJSON: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [484000, 5885000],
        },
      },
    ],
  },
  overwrite: true, // defaults to false
})
```

Calling the action `addFeatures` expects an object containing the parameter `geoJSON`, which is a [GeoJSON](https://geojson.org/) FeatureCollection.  
It adds the given features from the FeatureCollection to the drawn source. It is also possible to completely overwrite them using the parameter `overwrite`.

It's important to note that the GeoJSON Standard [RFC7946](https://www.rfc-editor.org/rfc/rfc7946) does not support circles.
To add a circle to the map, it is assumed, that a feature being a circle has a property `radius` together with a point geometry.

#### setInteractions

>⚠️ This is a complex action and can not be used without further implementation in a client.

```js
// `yourInteractions` is of type `ol/interaction[]`
map.$store.dispatch('plugin/draw/setInteractions', yourInteractions)
```

Allows interactions of other sources to take precedence without overlapping with the Draw interactions. By using this action, it is ensured both the draw interactions are cleared and the outside interactions are clearable by the draw tool. With this, you may write client-specific geometry operations of arbitrarily specific nature. Please mind that the Draw tool will display that no draw mode is active during this time, requiring you to provide a different UI.

When setting drag-like interactions, add `_isPolarDragLikeInteraction` to the interaction. Regarding this, refer to the chapter "Special Flags" in the core documentation.

If you need additional code executed on removal, you may add a method to `yourInteraction._onRemove`. It will be called on clean-up without parameters.

#### zoomToFeature

```js
map.$store.dispatch('plugin/draw/zoomToFeature', {
  index: 42, // defaults to 0
  margin: 420, // defaults to 20
})
```

Calling the action `zoomToFeature` zooms to the feature with position `index`, if given, and fits the map view around it with a padding of size `margin` in every direction of the feature.

#### zoomToAllFeatures

```js
map.$store.dispatch('plugin/draw/zoomToAllFeatures', {
  margin: 420, // defaults to 20
})
```

Calling the action `zoomToFeature` zooms to all drawn features, fits them in the map view with a padding of size `margin` in every direction of the features.
