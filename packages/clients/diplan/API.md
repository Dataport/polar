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
| mergeToMultiGeometries | boolean? | Defaults to `false`. If `true`, the exported FeatureCollection in getter `revisedDrawExport` will have merged geometries; that is, instead of Points, Lines, and Polygons, only MultiPoints, MultiLines, and MultiPolygons will be featured, created by merging the features of their respective geometry. All geometry types that are enabled in the `Draw` tool may occur. This step is executed before geometry validation and meta service usage. |
| metaServices | metaService[]? | Specification of a service that contains meta-information regarding geometries. Information from there will be added to features in getter `revisedDrawExport`. |
| renderType | 'iconMenu' \| 'independent'? | If set to `independent`, the displayed view for the GeoEditing plugin is minified to a vertical list of buttons of icons instead of a list of buttons including descriptions. The plugin then may be used outside of an IconMenu. Defaults to `iconMenu`. |
| validateGeoJson | boolean? | Defaults to `true`. If `true`, all geometries in getter `revisedDrawExport` will undergo a validity check before they are exported. To inspect the validity of the offered geometries, inspect the getter `simpleGeometryValidity` that indicates validity with a `boolean`. |

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

#### diplan.metaService

| fieldName | type | description |
| - | - | - |
| id | string | Id of the vector layer to make use of in the meta service. |
| aggregationMode | enum['unequal', 'all']? | Defaults to `'unequal'`. In mode `'unequal'`, one of each property set is kept; duplicate property sets are dropped. In mode `'all'`, all property sets are kept without further filtering. |
| propertyNames | string[]? | Names of the properties to build aggregations from. If left undefined, all found properties will be used. |

From all geometries of the service intersecting our geometries, properties are aggregated.

Example: Our drawing feature touches these features in the layer with id `"metaSourceExampleId"`:

```json
{
  "type": "Feature",
  "geometry": "...",
  "properties": { "a": 0, "b": 0 }
},
{
  "type": "Feature",
  "geometry": "...",
  "properties": { "a": 0, "b": 1 }
},
{
  "type": "Feature",
  "geometry": "...",
  "properties": { "a": 0, "b": 1 }
},
{
  "type": "Feature",
  "geometry": "...",
  "properties": { "a": 1, "b": 1 }
}
```

The feature will then have the following properties:

In mode `'unequal'`:

```json
{
  "type": "Feature",
  "geometry": "...",
  "properties": {
    "metaProperties": {
      "metaSourceExampleId": [
        { "a": 0, "b": 0 },
        { "a": 0, "b": 1 },
        { "a": 1, "b": 1 }
      ]
    }
  }
}
```

In mode `'all'`:

```json
{
  "type": "Feature",
  "geometry": "...",
  "properties": {
    "metaProperties": {
      "metaSourceExampleId": [
        { "a": 0, "b": 0 },
        { "a": 0, "b": 1 },
        { "a": 0, "b": 1 },
        { "a": 1, "b": 1 }
      ]
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

## Store

### Getters

| fieldName | type | description |
| - | - | - |
| revisedDrawExport | GeoJSON.FeatureCollection | The features produced with draw operations can be subscribed to via this getter. The "pure" variants can be fetched from the plugin `@polar/plugin-draw`, see its documentation. This "revised" variant includes all changes from the configuration of `mergeToMultiGeometries` and `metaServices`, i.e. the features may be merged and enriched with additional information for further processing. |
| revisionInProgress | boolean | Returns `true` if there are ongoing asynchronous operations. While true, the `revisedDrawExport` variable shall not be considered finished. |
| simpleGeometryValidity | boolean | Indicator of whether the OGC Simple Feature Specification (part of [SFA](https://www.ogc.org/de/publications/standard/sfa/)) rules are fulfilled. |

⚠️ Caveat: Please mind that there is currently no merge-logic for properties of features given via using the action `'plugin/draw/addFeatures'` of `@polar/plugin-draw`. If `mergeToMultiGeometries` is set true, an arbitrary set of properties will survive. If `metaServices` are set, `properties.metaProperties` will be overridden if they previously existed. It is assumed that incoming data shall only be recognized regarding its geometry and holds no properties.

```js
mapInstance.$store.watch(
  (_, getters) => getters['diplan/revisedDrawExport'],
  (geoJsonFeatureCollection) => {
    /* This code is called on value updates. */
  }
)
```

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