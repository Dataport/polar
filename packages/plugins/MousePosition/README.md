# MousePosition

## Scope

The MousePosition plugin makes the current mouse position as coordinates available. An optional select menu is configurable to allow users to switch to their preferred coordinate reference system.

## Configuration

### mousePosition

TODO this is in conflict to the type file

| fieldName | type | description |
| - | - | - |
| crsOptions | string[]? | Array of usable projections by proj4 string. Default options are the  `namedProjections` defined in POLAR/packages/core. The default selection is the leading coordinate system `epsg`. |

## Store

### State
