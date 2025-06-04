# PointerPosition

## Scope

The PointerPosition plugin makes the current/last pointer position available as coordinates. An optional select menu is configurable to allow users to switch to their preferred coordinate reference system.

## Configuration

### pointerPosition

| fieldName | type | description |
| - | - | - |
| projections | projection[]? | List of which projections from the `namedProjections` to use, i.e., only a subset can be chosen here. If not given, all EPSG systems configured in `namedProjections` will be chosen. In both cases, the coordinate reference system that is first in the list will be used as initial selection. If only one system is available, the selection element will be omitted. |

#### pointerPosition.projection

| fieldName | type | description |
| - | - | - |
| code | `EPSG:${string}` | Configured codes must be defined via the core's configuration field `namedProjections` or its default value. |
| decimals | number? | If no decimal count is given for a projection, the decimals are defaulted to 4. |

## Store

### Actions

#### setSelectedProjection

This sets the active EPSG to output coordinates in.

```js
map.$store.dispatch('plugin/pointerPosition/setSelectedProjection', 0)
```

Dispatch the index from the `projections` that is to be used. If none are configured, see `mapConfiguration`'s `namedProjections`' for index order. If none is configured, see the `@polar/core`'s exported object `mpapiDefaults` for index order. The value is initially `0`.

### Getters

| fieldName | type | description |
| - | - | - |
| coordinateString | string | The `pointerPosition` as `X, Y` string with configured `decimals` applied. |
| pointerPosition | [number, number] | The coordinate converted to the selected projection. |

```js
mapInstance.$store.watch(
  (_, getters) => getters['plugins/pointerPosition/coordinateString'],
  (coordinateString) => {
    /* This code is called on value updates. */
  }
)
```
