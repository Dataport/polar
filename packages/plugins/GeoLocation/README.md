# GeoLocation

## Scope

The GeoLocation plugin is responsible for collecting and displaying a user's GPS location. It is shown as a crosshair mark on the map.
The tracking can be triggered initially on startup or via a button. This behavior can be controlled by setting `checkLocationInitially` to
either `true` or `false`. When a users denies the location tracking, the button for this plugin gets disabled.

## Configuration

#### geoLocation

| fieldName | type | description |
| - | - | - |
| boundaryLayerId | string? | Id of a vector layer to restrict geolocation markers and zooms to. When geolocation outside of its features occurs, a single information will be shown. When loading the boundary layer, the map will wait at most 10s; should it not happen, the geolocation feature is turned off. |
| boundaryOnError | ('strict' \| 'permissive')? | If the boundary layer check does not work due to loading or configuration errors, style `'strict'` will disable the geolocation feature, and style `'permissive'` will act as if no boundaryLayerId was set. Defaults to `'permissive'`. |
| checkLocationInitially | boolean? | If `true` the location gets checked on page load. When `false` this can be triggered with a button. Defaults to `false`. |
| keepCentered | boolean? | If `true`, the map will re-center on the user on any position change. If `false`, only the first position will be centered on. Defaults to `false`. |
| renderType | 'iconMenu' \| 'independent'? | If nested in `IconMenu`, select 'iconMenu' to match styling. Defaults to 'independent'. |
| showTooltip | boolean? | If set to `true`, a tooltip will be shown when hovering the geoposition marker in the map, indicating that it shows the user's position. Defaults to `false`. |
| toastAction | string? | If the user is not locatable within the boundary of the maps extent or the boundary of the layer of `boundaryLayerId`, this string will be used as action to send a toast information to the user. If no toast information is desired, leave this field undefined; for testing purposes, you can still find information in the console. |
| zoomLevel | number? | Specifies to which zoom level gets zoomed after a successfull tracking of the location. Defaults to `7`. |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

Example configuration:

```js
geoLocation: {
  checkLocationInitially: true,
  keepCentered: true,
  renderType: 'independent',
  zoomLevel: 7,
  boundaryLayerId: 'hamburgBorder',
  boundaryOnError: 'strict',
  showTooltip: true,
  toastAction: 'plugin/toast/addToast',
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
