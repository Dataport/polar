# GeoLocation

## Scope

The GeoLocation plugin is responsible for collecting and displaying a user's GPS location. It is shown as a crosshair mark on the map.
The tracking can be triggered initially on startup or via a button. This behavior can be controlled by setting `checkLocationInitially` to
either `true` or `false`. When a users denies the location tracking, the button for this plugin gets disabled.

## Configuration

#### geoLocation

| fieldName              | type    | description                                                                                                                                                                                                                                                                                         |
| ---------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| checkLocationInitially | boolean | If `true` the location gets checked on page load. When `false` this can be triggered with a button.                                                                                                                                                                                                 |
| zoomLevel              | number  | Specifies to which zoom level gets zoomed after a successfull tracking of the location.                                                                                                                                                                                                             |
| keepCentered           | boolean | False by default. If true, the map will re-center on the user on any position change. If false, only the first position will be centered on.                                                                                                                                                        |
| boundaryLayerId        | string? | Id of a vector layer to restrict geolocation markers and zooms to. When geolocation outside of its features occurs, an information will be shown once and the feature is stopped. The map will wait at most 10s for the layer to load; should it not happen, the geolocation feature is turned off. |
| boundaryOnError | ('strict' \| 'permissive')? | If the boundary layer check does not work due to loading or configuration errors, style `'strict'` will disable the geolocation feature, and style `'permissive'` will act as if no boundaryLayerId was set. Defaults to `'permissive'`. |
| showTooltip | boolean? | If set `true`, a tooltip will be shown when hovering the geoposition marker in the map, indicating that it shows the user's position. Defaults to `false`. |
| renderType | 'iconMenu' \| 'independent'? | If nested in `IconMenu`, select 'iconMenu' to match styling. Defaults to 'independent'. |
| toastAction            | string? | If `boundaryLayerId` is set, and the user is not locatable within the boundary, this string will be used as action to send a toast information to the user. If no toast information is desired, leave this field undefined; for testing purposes, you can still find information in the console.    |

#### Example configuration

```json
{
  "geoLocation": {
    "checkLocationInitially": true,
    "zoomLevel": 7
  }
}
```

## Store

### State

If the access to an users location has been granted, the coordinates get stored in the `position` state value. This value can be subscribed through the path `'plugin/geoLocation/position'`.

```js
map.subscribe('plugin/geoLocation/position', (position) => {
  /* Your code here */
})
```
