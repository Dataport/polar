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
| selectableDrawModes | string[]? | List 'Point', 'LineString', 'Circle', 'Text' and/or 'Polygon' as desired. All besides 'Text' are selectable by default. |
| style | style? | Please see example below for styling options. Defaults to standard OpenLayers styling. |
| textStyle | object? | Use this object with properties 'font' and 'textColor' to style text feature. |

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
      fill: { color: 'rgba(255, 255, 255, 0.5)' },
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

##### draw.textStyle

| fieldName | type | description |
| - | - | - |
| font | object \| string | Style the font of the text feature with either css font properties or use font as an object with properties 'size' and 'family'. |
| textColor | string? | Define text color in hex or rgb / rgba code. |

Example configuration:
```js
  textStyle: {
      font: {
        size: [10.5, 20, 30.5, 35],
        family: 'serif'
      },
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
      }
    },
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
