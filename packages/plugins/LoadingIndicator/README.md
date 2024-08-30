# LoadingIndicator

## Scope

A generic loading indicator that may be used by any plugin or outside procedure to indicate loading.

## Configuration

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

Example configuration:
```js
loadingIndicator: {
  loaderStyle: 'RollerLoader',
}
```

## Store

### Mutations

```js
// show loading indicator
map.$store.commit('plugin/loadingIndicator/addLoadingKey', key)
// hide loading indicator
map.$store.commit('plugin/loadingIndicator/removeLoadingKey', key)
```

![Loading indicator example](./readme_loadingIndicator_example.png)

The key must be unique and is managed using a Set. This ensures that it can't be added multiple times, and removing it once will remove it completely. To avoid name conflicts, it is recommended to use a key format like `{my-plugin-or-application-name}-{procedure-name}`. The `LoadingIndicator` is typically used for asynchronous operations.

Therefore, **always call `removeLoadingKey` in the `finally` block of your code** to prevent loading indicators from hanging.

### Getters

You may desire to listen to whether the loader is currently being shown.

| fieldName | type | description |
| - | - | - |
| showLoader | boolean | Whether the layer is currently shown. |

```js
mapInstance.$store.watch(
    (_, getters) => getters['plugin/loadingIndicator/showLoader'],
    (showLoader) => {
        /* This code is called on showLoader updates. */
    }
)
```
