# Zoom

## Scope

The Zoom plugin offers functionality regarding map zooming.

### Extension ideas

- Support zoom sliders https://openlayers.org/en/latest/examples/zoomslider.html
- Support rectangle zoom (as implemented in POLAR@1 FundstellenDB)
  - i.e. there's an activatable button and, while active, user may draw a rectangle; rectangle is then zoomed to

These items are currently not on the roadmap.

## Configuration

The Zoom plugin offers a plus/minus button, and will adjust itself to the map's zoom settings on initialization.  
It can be configured as followed.

| fieldName  | type                         | description                                                                                   |
|------------|------------------------------|-----------------------------------------------------------------------------------------------|
| renderType | 'iconMenu' \| 'independent'? | Whether the zoom related buttons are being rendered independently or as part of the IconMenu. Defaults to 'independent'. |
| showMobile | boolean?                     | Whether the zoom related buttons should be displayed on smaller devices; defaults to false.   |
## Store

### Getters

The map's zoom level can be listened to.

| fieldName              | type    | description                                   |
| ---------------------- | ------- | --------------------------------------------- |
| zoomLevel              | number  | Current OpenLayers zoom level.                |
| maximumZoomLevel       | number  | Maximum OpenLayers zoom level.                |
| minimumZoomLevel       | number  | Minimum OpenLayers zoom level.                |
| maximumZoomLevelActive | boolean | Whether the current zoomLevel is the maximum. |
| minimumZoomLevelActive | boolean | Whether the current zoomLevel is the minimum. |

#### Usage example

```js
map.subscribe('plugin/zoom/zoomLevel', (zoomLevel) => {
  /* This code is called on any zoomLevel update. */
})
```

### Actions

The zoomLevel can be set programmatically.

```js
map.$store.dispatch('plugin/zoom/setZoomLevel', zoomLevelNumber)
map.$store.dispatch('plugin/zoom/increaseZoomLevel')
map.$store.dispatch('plugin/zoom/decreaseZoomLevel')
```

Zooming to invalid zoom level numbers (that is, above maximum or below minimum) will be ignored. A user should not be offered interactionable buttons that result in no operation.
