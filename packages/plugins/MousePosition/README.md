# MousePosition

## Scope

The MousePosition plugin makes the current mouse position available as coordinates. An optional select menu is configurable to allow users to switch to their preferred coordinate reference system.

## Configuration

### mousePosition

| fieldName | type | description |
| - | - | - |
| projections | string[]? | Array of offered EPSG codes, e.g. `['EPSG:4326']`. Configured codes must be defined via the core's configuration field `namedProjections` or its default value; i.e., only a subset can be chosen here. If not given, all EPSG systems configured in `namedProjections` will be chosen. In both cases, the coordinate reference system that is first in the list will be used as initial selection. If only one system is available, the selection element will be omitted. |
| decimals | Record<`EPSG:${string}`, number>? | For each configured or defaulted to EPSG, the number of decimal places to use can be configured separately. If no decimal count is given for an EPSG, the decimals are defaulted to 4. |

## Store

### Actions

#### setSelectedProjection

This sets the active EPSG to output coordinates in.

```js
map.$store.dispatch('plugin/mousePosition/setSelectedProjection', 0)
```

Dispatch the index from the `projections` that is to be used. If none are configured, see `mapConfiguration`'s `namedProjections`' for index order. If none is configured, see the `@polar/core`'s exported object `mpapiDefaults` for index order. The value is initially `0`.

### Getters

| fieldName | type | description |
| - | - | - |
| mousePosition | [number, number] | The coordinate converted to the selected projection. |
| coordinateString | string | The `mousePosition` as `X, Y` string with configured `decimals` applied. |

```js
mapInstance.$store.watch(
  (_, getters) => getters['plugins/mousePosition/coordinateString'],
  (coordinateString) => {
    /* This code is called on value updates. */
  }
)
```
