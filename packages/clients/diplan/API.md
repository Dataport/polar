# POLAR client DiPlanKarten

This document describes the `@polar/client-diplan`-specific configuration options.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/diplan/client-diplan.html) that is also delivered as part of the package within the `./docs` folder.

For our example client, [see here](./example/prod-example.html).

## Configuration

DiPlan-specific configuration parameters belong within the `mapConfiguration` object and are registered to the key `diplan`.

### diplan

| fieldName | type | description |
| - | - | - |
| mergeMultiGeometries | boolean? | Defaults to `false`. If `true`, the exported FeatureCollection in getter `revisedDrawExport` will have merged geometries; that is, instead of Points, Lines, and Polygons, only MultiPoints, MultiLines, and MultiPolygons will be featured, created by merging the features of their respective geometry. All geometry types that are enabled in the `Draw` tool may occur. This step is executed before geometry validation and meta service usage. |
| validateGeoJson | boolean? | Defaults to `true`. If `true`, all exports will undergo a validity check before they are exported. To inspect the validity of the offered geometries, inspect the getter `simpleGeometryValidity` that indicates validity with a `boolean`. |
| metaServices | metaService[] | Specification of a service that contains meta-information regarding geometries. |

#### diplan.metaService

| fieldName | type | description |
| - | - | - |
| id | string | Id of the vector layer to make use of in the meta service. |
| propertyNames | string[]? | Names of the properties to build aggregations from. If left undefined, all found properties will be used. |
| aggregationMode | enum['unequal', 'all']? | Defaults to `'unequal'`. In mode `'unequal'`, one of each property set is kept; duplicate property sets are dropped. In mode `'all'`, all property sets are kept without further filtering. |

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

## State

### Getters

| fieldName | type | description |
| - | - | - |
| revisedDrawExport | GeoJSON.FeatureCollection | Whether the current zoomLevel is the maximum. |
| revisionInProgress | boolean | Returns `true` if there are ongoing asynchronous operations. While true, the `revisedDrawExport` variable shall not be considered finished. |
| simpleGeometryValidity | boolean | Indicator of whether SimpleGeometry rules are fulfilled. |

⚠️ Caveat: Please mind that there is currently no merge-logic for properties of features given from the outside. If `mergeMultiGeometries` is set true, an arbitrary set of properties will survive. If `metaServices` are set, `properties.metaProperties` will be overridden if they previously existed. It is assumed that incoming data shall only be recognized regarding its geometry.

```js
mapInstance.$store.watch(
  (_, getters) => getters['diplan/revisedDrawExport'],
  (geoJsonFeatureCollection) => {
    /* This code is called on value updates. */
  }
)
```
