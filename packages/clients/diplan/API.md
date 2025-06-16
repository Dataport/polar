# POLAR client DiPlanKarten

This document describes the `@polar/client-diplan`-specific configuration options.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/diplan/client-diplan.html).

For our example clients, [see here](./example/overview.html).

## Configuration

DiPlan-specific configuration parameters belong within the `mapConfiguration` object and are registered to the key `diplan`.

### diplan

| fieldName | type | description |
| - | - | - |
| link | link? | If configured, the LinkButton will be rendered with the given URL and icon. |
| renderType | 'iconMenu' \| 'independent'? | If set to `independent`, the displayed view for the GeoEditing plugin is minified to a vertical list of buttons of icons instead of a list of buttons including descriptions. The plugin then may be used outside of an IconMenu. Defaults to `iconMenu`. |

#### diplan.link

| fieldName | type | description |
| - | - | - |
| href | string | URL the LinkButton should open. |
| icon | string | Icon used for the LinkButton. |
| label | string | Label for the LinkButton. Can be a locale key. |

```js
{
  mapConfiguration: {
    diplan: {
      link: {
        href: 'https://example.com',
        icon: '$vuetify.icons.fullscreen-exit'
      }
    }
  }
}
```

## Usage of secured services

To be able to use secured services, the map client has to receive an OIDC token from the integrating application.
This can be done with the mutation `setOidcToken`.
The mutation has to be called whenever the token has been refreshed so that the map client always has a valid token.

```js
mapInstance.$store.commit('setOidcToken', 'base64encodedOIDCtoken')
```

If, however, a secured layer is supposed to be visible on start, the token also has to be provided via the configuration parameter `oidcToken`.

## Rerender hints

In some SPA applications, the map client may produce unexpected behaviour on rerenders. Should this still occur in `1.0.0-beta.1` or later, please try these methods:

* Use `mapInstance.$destroy()` in your framework's lifecycle's unmount method before new `createMap` calls.
* In general, your calls to our `watch` or `subscribe` methods should also be cleaned up to avoid leaks. These methods return `unwatch` or `unsubscribe` methods respectively, and can be called on any cleanup.
* Most frameworks will handle DOM regeneration on rerenders themselves. Should you need to clean up the DOM for arbitrary reasons yourself, this snippet may come in handy:
  ```js
    const polarstern = document.getElementById('polarstern-wrapper')
    const stellamaris = document.createElement('div')
    stellamaris.id = 'polarstern'
    polarstern?.parentElement?.replaceChild(stellamaris, polarstern)
  ```
