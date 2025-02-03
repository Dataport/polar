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
|selectableTravelModes|string[]|Specifies which selection of transportation modes (e.g. driving-car, driving-hgv, foot-walking, cycling-regular, wheelchair) is available to the user. In the default setting, all modes are offered.|
|selectable Preferences|string[]|Specifies which preferences for the route are offered to the user.|
|displayPreferences|bolean|Defines wether the preferences for the route are offered to the user for selection.|
|displayRouteTypesToAvoid|boolean|Defines wether route types to avoid are offered to the user for selection.|
|style|||
|style.stroke|||
|style.color|||
|style.width|||
|addressSearch|||
|addressSearch.addLoading|||
|addressSearch.removeLoading|||
|addressSearch.searchMethods|||
|addressSearch.searchMethods.queryParameters|||
|addressSearch.searchMethods.queryParameters.searchAddress|boolean||
|addressSearch.searchMethods.queryParameters.searchStreets|boolean||
|addressSearch.searchMethods.queryParameters.searchHouseNumbers|boolean||
|addressSearch.searchMethods.type|string||
|addressSearch.searchMethods.url|string|The url of the service to be used for the address search.|
|addressSearch.minLength|number||
|addressSearch.waitMs|number||

## Store // TODO: Ans Routing-Plugin anpassen

### Mutations

#### setSelectedGroupName

This can be used to change the selected search group by name.

```js
map.$store.commit(
  'plugin/addressSearch/setSelectedGroupName',
  'Parcel search'
)
```

Please mind that programmatically changing the search group will _not_ trigger a search, unlike a search group change by the user. If you need a search after change, consider the `search` action.

### Actions

#### search

This is a purely programmatical search method. It is not used by user input.

```js
map.$store.dispatch('plugin/addressSearch/search', {
  input: 'Station Road 12',
  autoselect: 'first',
})
```

The payload object supports the following fields:

| fieldName | type | description |
| - | - | - |
| input | string | Search string to be used. |
| autoselect | enum['first', 'only', 'never'] | By default, 'never' is selected, and results will be presented as if the user searched for them. Setting 'only' will autoselect if a single result was returned; setting 'first' will autoselect the first of an arbitrary amount of results >=1. |

### State

```js
map.subscribe('plugin/addressSearch/chosenAddress', (chosenAddress) => {
  /* Your code. */
})
```

Address object _as returned by search service_. The result and its fields differ depending on the used backend. The callback is used whenever the user clicks on a search result or started a one-result search, which results in an auto-select of the singular result.