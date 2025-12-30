# AddressSearch

## Scope

The AddressSearch plugin allows users to search for an address. If multiple addresses are returned by services, the user is prompted to select a result.

The plugin saves the chosen information as GeoJSON to the store so that following procedures may grab it or so that other plugins may use it.

Currently supported services:

- BKG
- WFS
- Hamburg WFS-G (`mpapi`), may fit some WFS-G outside HH, test advised

## Configuration

### addressSearch

The configuration allows defining and grouping services. Grouped services can be requested in a search at the same time, and one group of searches can be active at a time. When multiple searches are in a group, they may be extended with category information to make the results easier to browse.

It is advised to either use one-search-per-group _or_ all services in a singular group to avoid an overly complex UI. Mixed configurations may be required for more complex search requirements.

In `categoryProperties` and `groupProperties`, id strings called `groupId` and `categoryId` are used. These are arbitrary strings you can introduce and reuse to group or categorize elements together. Regarding what groups and categories are, see further below.

| fieldName | type | description |
| - | - | - |
| categoryProperties | Record<string, categoryProperties>? | An object defining properties for a category. The searchMethod's categoryId is used as identifier. A service without categoryId does not have a fallback category. |
| focusAfterSearch | boolean? | Whether the focus should switch to the first result after a successful search. Defaults to `false`. |
| groupProperties | Record<string, groupProperties>? | An object defining properties for a group. The searchMethod's groupId is used as identifier. All services without groupId fall back to the key `"defaultGroup"`. |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

<details>
<summary>Example configuration</summary>

```js
import Component from './component.vue'

addressSearch: {
  searchMethods: [
    {
      queryParameters: {
        searchAddress: true,
        searchStreets: true,
        searchHouseNumbers: true,
      },
      type: 'mpapi',
      url: 'example-url.com',
    },
    {
      queryParameters: {
        filter: {
          bundesland: 'Schleswig-Holstein',
        },
      },
      type: 'bkg',
      url: 'other-example-url.com',
    },
    {
      type: 'wfs'
      queryParameters: {
        srsName: 'EPSG:25832',
        typeName: 'address_shp',
        fieldName: 'objektid',
        featurePrefix: 'app',
        xmlns: 'http://www.deegree.org/app',
        useRightHandWildcard: true,
      },
    }
  ],
  groupProperties: {
    defaultGroup: {
      limitResults: 5,
    },
  },
  focusAfterSearch: true,
  minLength: 3,
  waitMs: 300,
  addLoading: 'plugin/loadingIndicator/addLoadingKey',
  removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
},
```

</details>

#### addressSearch.searchMethodsObject

| fieldName | type | description |
| - | - | - |
| type | enum["bkg", "wfs", "mpapi"] | Service type. Enum can be extended by configuration, see `addressSearch.customSearchMethods`. |
| url | string | Search service URL. Should you require a service provider, please contact us for further information. |
| categoryId | string? | Grouped services can optionally be distinguished in the UI with categories. See `addressSearch.categoryProperties` for configuration options. |
| groupId | string? | Default groupId is `"defaultGroup"`. All services with the same id are grouped and used together. See `addressSearch.groupProperties` for configuration options. If multiple groups exist, the UI offers a group switcher. |
| hint | string? | Hint that is displayed below the input field if no other plugin-state-based hint is to be displayed. Can be a locale key. If grouped with other services, the group's hint will be used instead. |
| label | string? | Display label. Can be a locale key. If grouped with other services, the group's label will be used instead. |
| placeholder | string? | Placeholder string to display on input element. Can be a locale key. If grouped with other services, the group's placeholder will be used instead. |
| queryParameters | object? | The object further describes details for the search request. Its contents vary by service type, see documentation below. |

Example configuration:
```js
 searchMethods: [
  {
    groupId: 'groupAdressSearch',
    categoryId: 'categoryAddressSearch',
    type: 'bkg',
    url: 'example.com',
    hint: 'Input of e.g. street or address',
    label: 'Street search',
    placeholder: 'Street name',
    queryParameters: {
      filter: {
        bundesland: 'Schleswig-Holstein',
      },
    },
  },
],

#### addressSearch.customSearchMethod

This is a function with the following signature:

```ts
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

```ts
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

| fieldName | type | description |
| - | - | - |
| label | string | Display label. Can be a locale key. |
| resultDisplayMode | enum['mixed', 'categorized'] | Defaults to `'mixed'`. In `'mixed'`, results of all requested services are offered in a list in no specific order. In `'categorized'`, the results are listed by their searchService's categoryId. |
| hint | string? | Hint that is displayed below the input field if no other plugin-state-based hint is to be displayed. Can be a locale key. |
| limitResults | number? | If set, only the first `n` results (per category in `categorized`) are displayed initially. All further results can be opened via UI. |
| placeholder | string? | Placeholder string to display on input element. Can be a locale key. |

Example configuration:
```js
groupProperties: {
  groupAdressSearch: {
    label: 'Street search',
    hint: 'Please enter a street name',
    resultDisplayMode: 'categorized',
    limitResults: 3,
  },
  defaultGroup: {
    limitResults: 5,
  },
}
```

#### addressSearch.categoryProperties

| fieldName | type | description |
| - | - | - |
| label | string | Category label to display next to results to identify the source. Can be a locale key. Only relevant if the search's `groupProperties` linked via `groupId` contain a `resultDisplayMode` scenario that uses categories. |

Example configuration:
```js
categoryProperties: {
  categoryAddressSearchAutocomplete: {
    label: 'Address search hits',
  },
}
```

##### addressSearch.searchMethodsObject.queryParameters (type:common)

These fields are interpreted by all implemented services.

| fieldName | type | description |
| - | - | - |
| maxFeatures | number? | Maximum amount of features to retrieve. Doesn't limit results if not set. |

Example configuration:
```js
queryParameters: {
  maxFeatures: 120,
},
```

## Store

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
