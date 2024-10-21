# MousePosition

## Scope

The MousePosition plugin is responsible for displaying the current mouse position as coodinates in the buttom-left corner of the map. An optional select menue is configurable to give users the option of selecting their preferred coordinate reference system.

## Configuration

### mousePosition

| fieldName | type | description |
| - | - | - |
| crsOptions | string[]? | Array of usable projections by proj4 string. Default options are the  `namedProjections` defined in POLAR/packages/core. The default selection is the leading coordinate system `epsg`. |

## Store

### State