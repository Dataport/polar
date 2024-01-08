# Reverse Geocoder

## Scope

Reverse Geocoder Plugin that turns coordinates into addresses via a WPS. It does not offer any UI by itself.

This module has been written for the HH WPS service. The return format is custom and no other WPS are currently supported. Please mind this when trying to use this plugin with any other WPS. For usage with other WPS, those must either fit the HH WPS, or a generalization of this plugin is required.

## Configuration

### reverseGeocoder

| fieldName        | type    | description                                                                                                                                                                                        |
| ---------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url              | string  | URL of the WPS to use for reverse geocoding.                                                                                                                                                       |
| coordinateSource | string? | Points to a path in the store where a coordinate may be. If given, ReverseGeocoder will resolve on any updates. If not given, ReverseGeocoder is passive and waits for its action to be called. Please mind that, when referencing another plugin, that plugin must be in `addPlugins` before this one. |
| addressTarget    | string? | Points to a path in the store where an address can be put. If given, ReverseGeocoder will update on resolve. If not given, ReverseGeocoder's results can only be retrieved by awaiting its action. |
| addLoading       | string? | Points to an action in the store; commited with a loading key as payload on starting reverse geocoding.                                                                                            |
| removeLoading    | string? | Points to an action in the store; commited with a loading key as payload on finishing reverse geocoding.                                                                                           |
| zoomTo           | number? | If specified, plugin zooms to given coordinate after successful reverse geocoding; number indicates maximal zoom level.                                                                            |

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
