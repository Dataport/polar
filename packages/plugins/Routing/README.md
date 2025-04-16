# Routing

The Routing Plugin offers a routing functionality to the user.

## Scope
The user can choose the start and endpoint of the route either with a click on the map, by entering coordinates or by entering an address. The User has to choose a travel mode and a preferred route before the request can be processed. The user can optionally choose a route type to avoid. The requested route is drawn on the map. The user can reset the form and clear the map at the same time. Once a route is requested by the user, a detailed listing of every route segment is available including instructions, distance and duration.

This module has been written for the "BKG-Routing-Service" and uses the "Adressservice Hamburg" for the address search. The return format is custom and no other Services are currently supported. Please mind this when trying to use this plugin with any other routing or address search services. For usage with other services, those must either fit the current ones, or a generalization of this plugin is required.

## Configuration

| fieldName | type | description |
| - | - | - |
|serviceUrl|string|The url of the routing service to be used.|
|format|string|The format in which the answer of the routing service is expected in.|
|selectableTravelModes|string[]|Specifies which selection of transportation modes (driving-car, driving-hgv, foot-walking, cycling-regular, wheelchair) is available to the user. In the default setting, all modes are offered.|
|selectable Preferences|string[]|Specifies which preferences for the route (recommended, fastest, shortest) are offered to the user.|
|displayPreferences|bolean|Defines wether the preferences for the route are offered to the user for selection.|
|displayRouteTypesToAvoid|boolean|Defines wether route types to avoid are offered to the user for selection.|
|routeStyle|style? | Please see example below for styling options. Defaults to standard OpenLayers styling. |
|routeStyle.stroke|||
|addressSearch|||
|searchMethods | searchMethodsObject[] | Array of search method descriptions. Only searches configured here can be used. |
|minLength | number? | Minimal input length after which searches are started. Defaults to 0. |
|waitMs | number? | Debounce time in ms for search requests after last user input. Defaults to 0. |

#### routeStyle.stroke

| fieldName | type | description |
| - | - | - |
|routeStyle.color|||
|routeStyle.width|||

<details>

The `@masterportal/masterportalapi` has vectorStyles in development. As soon as that's done, we shall use its styling syntax and methods.

For the time being, please use this example as a rough reference as to what can currently be done.

<summary>Example configuration</summary>

```js
routing: {
    routeStyle: {
    stroke: {
      color: '#e51313',
      width: 6,
    },
  },
}
```

</details>

#### addressSearch.searchMethodsObject

| fieldName | type | description |
| - | - | - |
| queryParameters | object? | The object further describes details for the search request. Its contents vary by service type, see documentation below. |
| type | enum["bkg", "wfs", "mpapi"] | Service type. For now, mpapi is the only option. |
| url | string | Search service URL. Should you require a service provider, please contact us for further information. |

##### addressSearch.searchMethodsObject.queryParameters (type:mpapi)

> **Please mind that this requires a configured backend. A WFS's Stored Query is requested with predefined parameters using the [masterportalapi](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). This implementation is meant for e.g. https://geodienste.hamburg.de/HH_WFS_GAGES, but works with other WFS configured in the same manner.**

| fieldName | Type | Description |
| - | - | - |
| searchAddress | Boolean? | Defines whether address search is active. For backward compatibility, if "searchAddress" is not configured, the "searchAddress" attribute is set to "true" when "searchStreets" and "searchHouseNumbers" are set to "true". |
| searchStreets | Boolean? | Defines whether street search is active. Precondition to set `searchHouseNumbers` to `true`. |
| searchHouseNumbers | Boolean? | Defines whether house numbers should be searched for. Requires `searchStreets` to be set to `true`, too. |

While all fields are optional, configuring none of them will yield undefined behaviour. At least one search instruction should be set to `true`.

```js
type: 'mpapi'
queryParameters: {
  searchAddress: true,
  searchStreets: true,
  searchHouseNumbers: true,
},
```
