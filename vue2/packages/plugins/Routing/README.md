# Routing

The Routing Plugin offers a routing functionality to the user.

## Scope

A user can select multiple waypoints by clicking on the map, which then are converted to an address, if a reverse geocoder is configured.
If at least two waypoints have been added, the route is automatically calculated and displayed on the map.

The travel mode can be adjusted as well as the types of routes to avoid.
Similarly, the route preference is set to 'recommended' by default, but can be changed to 'fastest' or 'shortest'.

Once a route is available, a detailed listing of every route segment is available including instructions, distance and duration.

## Configuration

### routing

| fieldName | type | description |
| - | - | - |
| apiKey | string | The API key to access the routing service. Required for OpenRouteService. |
| format | 'geojson' | The format in which the answer of the routing service is expected in. The OpenRouteService also support `'json'` and `'gpx'`, which are currently not supported. |
| type | 'ors' | The type of routing service to be used. Currently, only the [OpenRouteService](https://openrouteservice.org/) (`'ors'`) is implemented. |
| url | string | The url of the routing service to be used. |
| displayPreferences | boolean? | Defines whether the user can choose their route preference. Defaults to `false`. |
| displayRouteTypesToAvoid | boolean? |Defines whether the user can select types of routes to avoid. Defaults to `false`. |
| selectableTravelModes | string[]? | List of available travel modes. Accepts `'driving-car'`, `'driving-hgv'`, `'cycling-regular'`, `'foot-walking'` and `'wheelchair'`. Defaults to `['driving-car', 'cycling-regular', 'foot-walking']`. |
