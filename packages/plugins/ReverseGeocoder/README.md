# Reverse Geocoder

## Scope

Reverse Geocoder Plugin that turns coordinates into addresses via a WPS. It does not offer any UI by itself.

This module has been written for the HH WPS service. The return format is custom and no other WPS are currently supported. Please mind this when trying to use this plugin with any other WPS. For usage with other WPS, those must either fit the HH WPS, or a generalization of this plugin is required.

## Configuration

### reverseGeocoder

| fieldName | type | description |
| - | - | - |
| url | string | URL of the WPS to use for reverse geocoding. |
| addLoading | string? | Expects the path to a mutation within the store. This mutation is committed with a plugin-specific loading key as payload when starting asynchronous procedures that are intended to be communicated to the user. |
| addressTarget | string? | Points to a path in the store where an address can be put. If given, ReverseGeocoder will update on resolve. If not given, ReverseGeocoder's results can only be retrieved by awaiting its action. |
| coordinateSource | string? | Points to a path in the store where a coordinate may be. If given, ReverseGeocoder will resolve on any updates. If not given, ReverseGeocoder is passive and waits for its action to be called. Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one. |
| removeLoading | string? | Expects the path to a mutation within the store. This mutation is committed with a plugin-specific loading key as payload when finishing asynchronous procedures that are intended to be communicated to the user. |
| zoomTo | number? | If specified, plugin zooms to given coordinate after successful reverse geocoding; number indicates maximal zoom level. |


Example configuration:
```js
reverseGeocoder: {
  url: 'someWebProcessingServiceUrl.com'
  coordinateSource: 'plugin/pins/transformedCoordinate',
  addressTarget: 'plugin/addressSearch/selectResult',
  addLoading: 'plugin/loadingIndicator/addLoadingKey',
  removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
  zoomTo: 7,  
}
```

## Store

The ReverseGeocoder plugin does not hold any state.

### Actions

```js
// result contains the resolved address (exact format depends on WPS)
const result = await map.$store.dispatch(
  'plugin/reverseGeocoder/reverseGeocode',
  {
    coordinate, // [number, number]
  }
)
```
