# Routing

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
