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

TODO

### State

TODO
