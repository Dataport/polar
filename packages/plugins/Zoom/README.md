# Zoom

## Scope

The Zoom plugin offers functionality regarding map zooming.

## Configuration

The Zoom plugin offers a plus/minus button, and will adjust itself to the map's zoom settings on initialization.  
It can be configured as followed.

| fieldName | type | description |
| - | - | - |
| renderType | 'iconMenu' \| 'independent'? | Whether the zoom related buttons are being rendered independently or as part of the IconMenu. Defaults to `'independent'`. |
| showMobile | boolean? | Whether the zoom related buttons should be displayed on smaller devices; defaults to `false`. |
| showZoomSlider | boolean? | Whether a zoom slider should be displayed under the zoom buttons. Won't be rendered on smaller devices; defaults to `false`.|

Example configuration:
```js
zoom: {
  renderType: 'independent',
  showMobile: false,
  showZoomSlider: true,
}
```

## Store

### State

The map's zoom level can be listened to.

| fieldName | type | description |
| - | - | - |
| zoomLevel | number | Current OpenLayers zoom level. |
| maximumZoomLevel | number | Maximum OpenLayers zoom level. |
| minimumZoomLevel | number | Minimum OpenLayers zoom level. |

```js
map.subscribe('plugin/zoom/zoomLevel', (zoomLevel) => {
  /* This code is called on any zoomLevel update. */
})
```

### Getters

| fieldName | type | description |
| - | - | - |
| maximumZoomLevelActive | boolean | Whether the current zoomLevel is the maximum. |
| minimumZoomLevelActive | boolean | Whether the current zoomLevel is the minimum. |

```js
mapInstance.$store.watch(
  (_, getters) => getters['plugin/zoom/maximumZoomLevelActive'],
  (maximumZoomLevelActive) => {
    /* This code is called on value updates. */
  }
)
```

### Actions

The zoomLevel can be set programmatically.

```js
map.$store.dispatch('plugin/zoom/setZoomLevel', zoomLevelNumber)
map.$store.dispatch('plugin/zoom/increaseZoomLevel')
map.$store.dispatch('plugin/zoom/decreaseZoomLevel')
```

Zooming to invalid zoom level numbers (that is, above maximum or below minimum) will be ignored. A user should not be offered interactionable buttons that result in no operation.
