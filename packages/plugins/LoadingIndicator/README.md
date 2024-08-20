# LoadingIndicator

## Scope

A generic loading indicator that may be used by any plugin or outside procedure to indicate loading.

## Configuration

### loadingIndicator

| fieldName  | type | description |
| - | - | - |
| loaderStyle | enum['CircleLoader', 'BasicLoader', 'none', 'RingLoader', 'RollerLoader', 'SpinnerLoader', 'v-progress-linear']? | Choose between different loader styles. Defaults to 'v-progress-linear' (Vuetify loader). |

For details on the `displayComponent` attribute, refer to the [Global Plugin Parameters](../../core/README.md#global-plugin-parameters) section of `@polar/core`.

## Store

### Mutations

```js
// show loading indicator
map.$store.commit('plugin/loadingIndicator/addLoadingKey', key)
// hide loading indicator
map.$store.commit('plugin/loadingIndicator/removeLoadingKey', key)
```

The key must be unique and is kept track of via a Set. It can't be added multiple times, and removing it once always removes it altogether. It is advised to use a key like `{my-plugin-or-application-name}-{procedure-name}` to avoid name conflicts. The LoadingIndicator will usually be used for asynchronous code.

As such, **always call `removeLoadingKey` in the `finally` section of your code** to prevent hanging loading indicators.

```js
// change loader style at runtime
map.$store.commit('plugin/loadingIndicator/setLoaderStyle', loaderStyle)
```
#### Supported `loaderStyle` options

<table align="center">
  <tr align="center">
    <td width="33%" align="center"><img src="./assets/VuetifyLoader.gif" alt="v-progress-linear" height="120px" style="object-fit: none;"><div>v-progress-linear</div></td>
    <td width="33%" align="center"><img src="./assets/BasicLoader.gif" alt="BasicLoader" height="120px" style="object-fit: contain;"><div>BasicLoader</div></td>
    <td width="33%" align="center"><img src="./assets/RingLoader.gif" alt="RingLoader" height="120px" style="object-fit: contain;"><div>RingLoader</div></td>
  </tr>
  <tr align="center">
    <td width="33%" align="center"><img src="./assets/RollerLoader.gif" alt="RollerLoader" height="120px" style="object-fit: contain;"><div>RollerLoader</div></td>
    <td width="33%" align="center"><img src="./assets/CircleLoader.gif" alt="CircleLoader" height="120px" style="object-fit: contain;"><div>CircleLoader</div></td>
    <td width="33%" align="center"><img src="./assets/SpinnerLoader.gif" alt="SpinnerLoader" height="120px" style="object-fit: contain;"><div>SpinnerLoader</div></td>
  </tr>
</table>

It is also possible to choose `none` as a `loaderStyle` to hide the loader.

### Getters

You may desire to listen to whether the loader is currently being shown.

| fieldName | type | description |
| - | - | - |
| loaderStyle | string | The current loader style. |
| showLoader | boolean | Whether the layer is currently shown. |

```js
mapInstance.$store.watch(
    (_, getters) => getters['plugin/loadingIndicator/showLoader'],
    (showLoader) => {
        /* This code is called on showLoader updates. */
    }
)
```
