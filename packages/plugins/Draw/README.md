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

The styling of the drawn features can be configured to overwrite the default ol-style. Configuration is oriented around the [OpenLayers styles](https://openlayers.org/en/latest/apidoc/module-ol_style_Style.html#~StyleLike) and the [vector styling of the masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/src/vectorStyle/). 

### draw

| fieldName | type | description |
| - | - | - |
| enableOptions | boolean? | If `true`, draw options are displayed, like choosing and changing stroke color. Not available for texts features. Defaults to `false`. |
| circleStyle | CircleStyle? | Styling Object to style circle features. Defaults to OpenLayers Style. |
| lineStringStyle | LineStringStyle? | Styling Object to style linestring features. Defaults to OpenLayers Style. |
| pointStyle | PointStyle? | Styling Object to style point features. Defaults to OpenLayers Style. |
| polygonStyle | PolygonStyle? | Styling Object to style polygon features. Defaults to OpenLayers Style. |
| selectableDrawModes | string[]? | List 'Point', 'LineString', 'Circle', 'Text' and/or 'Polygon' as desired. All besides 'Text' are selectable by default. |
| textStyle | TextStyle? | Use this object with properties 'font' and 'textColor' to style text feature. |

Please note that the configuration of `circleStyle`, `lineStringStyle`, `pointStyle` and `polygonStyle` without all or some of their parameters result in the default style of the `masterportalApi` vectorStyling, which differs from the OpenLayers default style.

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
  polygonStyle: {
    polygonStrokeColor: [255, 165, 0, 1],
    polygonStrokeWidth: 2,
    polygonStrokeCap: 'round',
    polygonStrokeJoin: 'round',
    polygonStrokeDash: [2, 4],
    polygonStrokeDashOffset: 0,
    polygonStrokeMiterLimit: 10,
    polygonFillColor:  [10, 200, 0, 0.5],
  },
  pointStyle: {
    type: 'circle',
    circleFillColor: [255, 165, 0, 1],
    circleStrokeWidth: 2,
    circleStrokeColor: [0, 0, 255, 1],
    circleRadius: 10,
  },
  circleStyle: {
    circleFillColor: [0, 255, 0, 0.5],
    circleStrokeWidth: 5,
    circleStrokeColor: [0, 0, 0, 1],
  },
}
```

</details>

##### draw.circleStyle

| fieldName | type | description |
| - | - | - |
| circleFillColor | number[]? | Circle fill color as rgba. Defaults to `[0, 153, 255, 1]`. |
| circleStrokeColor | number[]? | Circle stroke color as rgba. Defaults to `2`. |
| circleStrokeWidth | number? | Circle stroke width. Defaults to `[0, 0, 0, 1]`. |

Example configuration:
```js
circleStyle: {
  circleStrokeColor?: [0, 255, 0, 0.5],
  circleStrokeWidth?: 5,
  circleFillColor?: [0, 0, 0, 1],
}
```

##### draw.lineStringStyle

For configurations, see the Masterportal's documentation file [style.json.md, section LineString](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md#markdown-header-linestring).

Example configuration:
```js
lineStringStyle: {
  lineStrokeColor: [255, 165, 0, 1],
  lineStrokeWidth: 3,
  lineStrokeCap: 'round',
  lineStrokeJoin: 'miter',
  lineStrokeDash: [1, 2, 1],
  lineStrokeDashOffset: 5,
  lineStrokeMiterLimit: 8,
}
```

##### draw.pointStyle

| fieldName | type | description |
| - | - | - |
| imageName | string? | Path to an image, must be defined if type is `'icon'`. |
| type | ('circle' \| 'icon')? | The type of the point style. This defines which parameters should  be configured. `'icon'` allows to set an image for the point style. `'circle'` displays the Point as circle with a given radius. Defaults to `'circle'`.|

For more configurations for the icon point, see the Masterportal's documentation file [style.json.md, section Point.Icon](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md#markdown-header-pointicon). For more configurations for the circle point, see [section Point.Circle](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md#markdown-header-pointcircle). 

Example configuration:
```js
pointStyle: {
  type: 'icon',
  imageName: 'http://simpleicon.com/wp-content/uploads/map-marker-17.png',
  imageWidth: 0.5,
  imageHeight: 0.5,
  imageScale: 0.1,
  imageOffsetX: 1,
  imageOffsetY: 1,
  imageOffsetXUnit: 'pixels',
  imageOffsetYUnit: 'pixels',
  rotation: {
    isDegree: false,
    value: 0,
   },
}
```

##### draw.polygonStyle

For configurations, see the Masterportal's documentation file [style.json.md, section Polygon](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/doc/style.json.md#markdown-header-polygon).

Example configuration:
```js
polygonStyle: {
  polygonStrokeColor: [255, 165, 0, 1],
  polygonStrokeWidth: 2,
  polygonFillHatch: {
    pattern: 'diagonal',
    lineWidth: 10,
    size: 30,
    backgroundColor: [10, 200, 0, 0.5],
    patternColor: [255, 255, 255, 1],
  },
}
```

##### draw.textStyle

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

###### draw.textStyle.font

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

## Store

### State

```js
map.subscribe('plugin/draw/featureCollection', (featureCollection) => {
  /* Your code. */
})
```

The returned featureCollection is a [GeoJSON](https://geojson.org/) FeatureCollection. It includes all drawn features and updates on changes.

## Actions

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

```js
map.$store.dispatch('plugin/draw/zoomToFeature', {
  index: 42, // defaults to 0
  margin: 420, // defaults to 20
})
```

Calling the action `zoomToFeature` zooms to the feature with position `index`, if given, and fits the map view around it with a padding of size `margin` in every direction of the feature.

```js
map.$store.dispatch('plugin/draw/zoomToAllFeatures', {
  margin: 420, // defaults to 20
})
```

Calling the action `zoomToFeature` zooms to all drawn features, fits them in the map view with a padding of size `margin` in every direction of the features.
