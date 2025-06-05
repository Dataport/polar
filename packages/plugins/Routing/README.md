# Routing

The Routing Plugin offers a routing functionality to the user.

## Scope

The user can choose the start and endpoint of the route either with a click on the map, by entering coordinates or by entering an address. The User has to choose a travel mode and a preferred route before the request can be processed. The user can optionally choose a route type to avoid. The requested route is drawn on the map. The user can reset the form and clear the map at the same time. Once a route is requested by the user, a detailed listing of every route segment is available including instructions, distance and duration.

## Configuration

### routing

| fieldName | type | description |
| - | - | - |
| format | 'json' \| 'geojson' \| 'gpx' | The format in which the answer of the routing service is expected in. |
| type | 'ors' | The type of routing service to be used. Currently, only the [OpenRouteService](https://openrouteservice.org/) (`'ors'`) is implemented. |
| url | string | The url of the routing service to be used. |
| displayPreferences | boolean? | Defines whether the user can choose their route preference. Defaults to `false`. |
| displayRouteTypesToAvoid | boolean? |Defines whether the user can select types of routes to avoid. Defaults to `false`. |
| selectableTravelModes | string[]? | List of available travel modes. Accepts `'driving-car'`, `'driving-hgv'`, `'cycling-regular'`, `'foot-walking'` and `'wheelchair'`. Defaults to `['driving-car', 'cycling-regular', 'foot-walking']`. |
