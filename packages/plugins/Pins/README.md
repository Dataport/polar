# Pins

## Scope

The pins plugin handles marking locations. Embedding processes can then use that coordinate for further steps. The plugin may react to other plugins, especially address searches.

## Configuration

The usage of `displayComponent` has no influence on the creation of Pins on the Map if this plugin is being used.

### pins

| fieldName        | type          | description                                                                                                                                                                                                                                                                                         |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appearOnClick    | appearOnClick?? | Pin restrictions. See object description below.                                                                                                                                                                                                                                                     |
| boundaryLayerId  | string?       | Id of a vector layer to restrict pins to. When pins are moved or created outside of the boundary, an information will be shown and the pin is reset to its previous state. The map will wait at most 10s for the layer to load; should it not happen, the geolocation feature is turned off.        |
| boundaryOnError | ('strict' \| 'permissive')? | If the boundary layer check does not work due to loading or configuration errors, style `'strict'` will disable the pins feature, and style `'permissive'` will act as if no boundaryLayerId was set. Defaults to `'permissive'`. |
| coordinateSource | string? | The pins plugin may react to changes in other plugins. This specifies the path to such store positions. The position must, when subscribed to, return a GeoJSON feature. Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one. |
| initial          | number[]?                               | Configuration options for setting an initial pin.                                                                                                                                                                                                                                                   |
| movable          | boolean? \| 'drag' \| 'click' \| 'none' | Whether a user may drag and re-click the pin (`drag` or `true`), only re-click it (`click`) or may only be placed programmatically (`none` or `false`). Defaults to 'none'. **Using a boolean for this configuration has been deprecated and will be removed in the next major release.**           |
| style            | style?        | Display style configuration.                                                                                                                                                                                                                                                                        |
| toastAction      | string?       | If `boundaryLayerId` is set, and the pin is moved or created outside the boundary, this string will be used as action to send a toast information to the user. If no toast information is desired, leave this field undefined; for testing purposes, you can still find information in the console. |
| toZoomLevel      | number? | Zoom level to use on outside input by e.g. address search. Defaults to `0`. |

#### pins.appearOnClick

| fieldName   | type    | description                              |
|-------------|---------|------------------------------------------|
| show        | boolean | Display marker.                          |
| atZoomLevel | number? | Minimum zoom level for sensible marking. Defaults to `0`. |

#### pins.initial

| fieldName   | type     | description                                                                                                                           |
|-------------|----------|---------------------------------------------------------------------------------------------------------------------------------------|
| coordinates | number[] | Coordinate pair for the pin.                                                                                                          |
| centerOn    | boolean? | If set to true, center on and zoom to the given coordinates on start. Defaults to false.                                              |
| epsg        | string?  | Coordinate reference system in which the given coordinates are encoded. Defaults to the `epsg` value defined in the mapConfiguration. |

#### pins.style

| fieldName | type    | description                                                               |
| --------- | ------- | ------------------------------------------------------------------------- |
| fill      | string? | Fill color of the pin. Defaults to blue (`#005CA9`).                      |
| stroke    | string? | Stroke (that is, border) color of the pin. Defaults to white (`#FFFFFF`). |

## Store

### State

```js
map.subscribe('plugin/pins/transformedCoordinate', (pinCoordinate) => {
  /* Your Code. */
})
```

The `pinCoordinate` is of type `[number, number]`.

```js
map.subscribe('plugin/pins/latLon', (pinCoordinate) => {
  /* Your Code. */
})
```

The `pinCoordinate` transcribed to latitude / longitude.
