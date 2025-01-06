# Measure

## Scope

The measure plugin offers the possibility to measure distances in (kilometers or meters) and areas (km² or m²) as multipoint lines and polygons.

## Configuration

### measure

| fieldName | type | description |
| - | - | - |
| color | string? | Color in hex or rgb / rgba code of the lines, polygons and points drawn to measure the distance or the area. Defaults to '#118bee'. |
| textColor | string? | Color in hex or rgb / rgba code of text displaying the measured distance or area. Defaults to '#118bee'. |

## Store

### State

The measured value in either metres / m² or kilometres / km² as a string.

```js
map.subscribe('plugin/measure/measure', (measuredValue) => {
  /* Your code. */
})
```

The currently selected unit. Either m / m² or km / km².

```js
map.subscribe('plugin/measure/selectedUnit', (selectedUnit) => {
  /* Your code. */
})
```
