# AddressSearch

## Scope

The AddressSearch plugin allows users to search for an address. If multiple addresses are returned by services, the user is prompted to select a result.

The plugin saves the chosen information as GeoJSON to the store so that following procedures may grab it or so that other plugins may use it.

Currently supported services:

- BKG
- WFS
- Some gazetteers/WFS-G (please request a check or try yourself, not 100% done)

## Configuration

### addressSearch

The configuration allows defining and grouping services. Grouped services can be requested in a search at the same time, and one group of searches can be active at a time. When multiple searches are in a group, they may be extended with category information to make the results easier to browse.

It is advised to either use one-search-per-group _or_ all services in a singular group to avoid an overly complex UI. Mixed configurations may be required for more complex search requirements.

In `categoryProperties` and `groupProperties`, id strings called `groupId` and `categoryId` are used. These are arbitrary strings you can introduce and reuse to group or categorize elements together. Regarding what groups and categories are, see further below.

| fieldName           | type                                  | description                                                                                                                                                                                                                                                            |
| ------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| minLength           | number                                | Minimal input length after which searches are started.                                                                                                                                                                                                                 |
| waitMs              | number                                | Debounce time in ms for search requests after last user input.                                                                                                                                                                                                         |
| searchMethods       | searchMethodsObject[]                 | Array of search method descriptions. Only searches configured here can be used.                                                                                                                                                                                        |
| customSearchMethods | Record<string, customSearchMethod>?   | An object with named search functions added to the existing set of configurable search methods. (See `addressSearch.searchMethodsObject.type`) This record's keys are added to that enum.                                                                              |
| customSelectResult  | Record<string, customSelectFunction>? | An object that maps categoryIds to functions. These functions are then called as vuex store actions instead of the `selectResult` default implementation. This allows overriding selection behaviour with full store access. Use `''` as key for categoryless results. |
| categoryProperties  | Record<string, categoryProperties>?   | An object defining properties for a category. The searchMethod's categoryId is used as identifier. A service without categoryId does not have a fallback category.                                                                                                     |
| focusAfterSearch | boolean? | Whether the focus should switch to the first result after a successful search. Defaults to `false`. |
| groupProperties     | Record<string, groupProperties>?      | An object defining properties for a group. The searchMethod's groupId is used as identifier. All services without groupId fall back to the key `"defaultGroup"`.                                                                                                       |

#### addressSearch.searchMethodsObject

| fieldName       | type                                     | description                                                                                                                                                                                                                |
| --------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| queryParameters | object                                   | The object further describes details for the search request. Its contents vary by service type, see documentation below.                                                                                                   |
| label           | string?                                  | Display label. Can be a locale key. If grouped with other services, the group's label will be used instead.                                                                                                                |
| placeholder     | string?                                  | Placeholder string to display on input element. Can be a locale key. If grouped with other services, the group's placeholder will be used instead.                                                                         |
| hint            | string?                                  | Hint that is displayed below the input field if no other plugin-state-based hint is to be displayed. Can be a locale key. If grouped with other services, the group's hint will be used instead.                           |
| type            | enum["bkg", "gazetteer", "wfs", "mpapi"] | Service type. Enum can be extended by configuration, see `addressSearch.customSearchMethods`. ⚠️ "gazetteer" is deprecated. Please use "mpapi" instead. |
| url             | string                                   | Search service URL. Should you require a service provider, please contact us for further information.                                                                                                                      |
| groupId         | string?                                  | Default groupId is `"defaultGroup"`. All services with the same id are grouped and used together. See `addressSearch.groupProperties` for configuration options. If multiple groups exist, the UI offers a group switcher. |
| categoryId      | string?                                  | Grouped services can optionally be distinguished in the UI with categories. See `addressSearch.categoryProperties` for configuration options.                                                                              |

#### addressSearch.customSearchMethod

This is a function with the following signature:

```
(
  // should be used to actually abort request
  signal: AbortSignal,
  // base url as configured
  url: string,
  // input value from address search input
  inputValue: string,
  // whatever was configured
  queryParameters: any
) => Promise<FeatureCollection> | never
```

With this, arbitrary services can be supported.

#### addressSearch.customSelectFunction

This is a function with the following signature:

```
({
  // VueX context object
  context,
  payload: {
    feature, // GeoJSON feature
    categoryId // if configured on searchService, else ''
  }
}) => void
```

With this, arbitrary click results can be supported. Please mind that undocumented mutations and actions fired in such a function are subject to change without further notice.

#### addressSearch.groupProperties

| fieldName         | type                         | description                                                                                                                                                                                        |
| ----------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| label             | string                       | Display label. Can be a locale key.                                                                                                                                                                |
| placeholder       | string?                      | Placeholder string to display on input element. Can be a locale key.                                                                                                                               |
| hint              | string?                      | Hint that is displayed below the input field if no other plugin-state-based hint is to be displayed. Can be a locale key.                                                                          |
| resultDisplayMode | enum['mixed', 'categorized'] | Defaults to `'mixed'`. In `'mixed'`, results of all requested services are offered in a list in no specific order. In `'categorized'`, the results are listed by their searchService's categoryId. |
| limitResults      | number?                      | If set, only the first `n` results (per category in `categorized`) are displayed initially. All further results can be opened via UI.                                                              |

#### addressSearch.categoryProperties

| fieldName | type   | description                                                                                                                                                                                                              |
| --------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| label     | string | Category label to display next to results to identify the source. Can be a locale key. Only relevant if the search's `groupProperties` linked via `groupId` contain a `resultDisplayMode` scenario that uses categories. |

##### addressSearch.searchMethodsObject.queryParameters (type:common)

These fields are interpreted by all implemented services.

| fieldName   | type   | description                             |
| ----------- | ------ | --------------------------------------- |
| maxFeatures | number | Maximum amount of features to retrieve. |

##### addressSearch.searchMethodsObject.queryParameters (type:wfs)

| fieldName     | type                   | description                                                                                                                                                                                                                                                                                                                                             |
| ------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| typeName      | string                 | Feature type to search for by name.                                                                                                                                                                                                                                                                                                                     |
| featurePrefix | string                 | XML feature prefix for WFS service.                                                                                                                                                                                                                                                                                                                     |
| xmlns         | string                 | XML namespace to use in search.                                                                                                                                                                                                                                                                                                                         |
| patterns      | string[]               | Allows specifying input patterns. In a single-field search, a pattern can be as easy as `{{theWholeThing}}`, where `theWholeThing` is also the feature field name to search in. In more complex scenarios, you may add separators and multiple fields, e.g. `{{gemarkung}} {{flur}} {{flstnrzae}}/{{flstnrnen}}` would fit many parcel search services. |
| patternKeys   | Record<string, string> | Maps field names from patterns to regexes. Each field name has to have a definition. Each regex must have one capture group that is used to search. Contents next to it are ignored for the search and just used for matching. E.g. `'([0-9]+)$'` would be a value for a key that fits an arbitrary number string at the input's end.                   |

Since inputs may overlap with multiple patterns, multiple queries are fired and executed on the WFS until the `maxFeatures` requirement is met, beginning with the pattern that 'looks like the user input the most'. The best-fitting pattern on the returned features will be used to generate a display string. When two patterns fit best, the first one is used.

##### addressSearch.searchMethodsObject.queryParameters (type:gazetteer)

> ⚠️ "gazetteer" is deprecated. Please use "mpapi" instead.

| fieldName     | type     | description                                                                                                   |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| memberSuffix  | string   | Elements to interpret are fetched from response XML as `wfs:memberSuffix`; fitting suffix must be configured. |
| namespaces    | string[] | Namespaces to add to the request.                                                                             |
| fieldName     | string[] | Field names of service to search in.                                                                          |
| storedQueryId | string   | Name of the WFS-G stored query that is to be used.                                                            |

##### addressSearch.searchMethodsObject.queryParameters (type:mpapi)

> **Please mind that this requires a configured backend. A WFS's Stored Query is requested with predefined parameters using the [masterportalApi](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). This implementation is meant for e.g. https://geodienste.hamburg.de/HH_WFS_GAGES, but works with other WFS configured in the same manner.**

| fieldName          | Type     | Description                                                                                                                                                                                                                 |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| searchAddress      | Boolean? | Defines whether address search is active. For backward compatibility, if "searchAddress" is not configured, the "searchAddress" attribute is set to "true" when "searchStreets" and "searchHouseNumbers" are set to "true". |
| searchDistricts    | Boolean? | Defines whether district search is active.                                                                                                                                                                                  |
| searchHouseNumbers | Boolean? | Defines whether house numbers should be searched for. Requires `searchStreets` to be set to `true`, too.                                                                                                                    |
| searchParcels      | Boolean? | Defines whether parcels search is active.                                                                                                                                                                                   |
| searchStreetKey    | Boolean? | Defines whether streets should be searched for by key.                                                                                                                                                                      |
| searchStreets      | Boolean? | Defines whether street search is active. Precondition to set `searchHouseNumbers` to `true`.                                                                                                                                |

While all fields are optional, configuring none of them will yield undefined behaviour. At least one search instruction should be set to `true`.

##### addressSearch.searchMethodsObject.queryParameters (type:bkg)

In _BKG_ mode, queryParameter's key-value pairs are used in the service query. E.g. `{filter: { bundesland: 'Bremen' }}` results in the GET request URL having `&filter=bundesland:Bremen` as suffix.

For more options, please check the [official documentation](https://sg.geodatenzentrum.de/web_public/gdz/dokumentation/deu/geokodierungsdienst.pdf) regarding what query parameters are interpreted.

Additionally, it is possible to configure the parameters `accesstoken` (`Authorization`) or `apiKey` (custom header `X-Api-Key`) to send the described headers to the search service for authentication purposes.  
Note that this changes the request to be non-simple. To be able to use the parameters, the request has to be sent in [`cors` mode](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode) and has to support preflight request `OPTIONS`.

## Store

### Mutations

#### setSelectedGroupName

This can be used to change the selected search group by name.

```js
map.$store.commit(
  'plugin/addressSearch/setSelectedGroupName',
  'Flurstückssuche'
)
```

Please mind that programmatically changing the search group will _not_ trigger a search, unlike a search group change by the user. If you need a search after change, consider the `search` action.

### Actions

#### search

This is a purely programmatical search method. It is not used by user input.

```js
map.$store.dispatch('plugin/addressSearch/search', {
  input: 'Bahnhofsstraße 12',
  autoselect: 'first',
})
```

The payload object supports the following fields:

| fieldName  | type                           | description                                                                                                                                                                                                                                       |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| input      | string                         | Search string to be used.                                                                                                                                                                                                                         |
| autoselect | enum['first', 'only', 'never'] | By default, 'never' is selected, and results will be presented as if the user searched for them. Setting 'only' will autoselect if a single result was returned; setting 'first' will autoselect the first of an arbitrary amount of results >=1. |

### State

```js
map.subscribe('plugin/addressSearch/chosenAddress', (chosenAddress) => {
  /* Your code. */
})
```

Address object _as returned by search service_. The result and its fields differ depending on the used backend. The callback is used whenever the user clicks on a search result or started a one-result search, which results in an auto-select of the singular result.
