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
| focusAfterSearch | boolean? | Whether the focus should switch to the first result after a successful search. Defaults to `false`. |

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
