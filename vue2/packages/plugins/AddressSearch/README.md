# AddressSearch

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
