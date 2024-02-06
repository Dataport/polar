# Fullscreen

## Scope

The fullscreen plugin allows viewing the map in fullscreen mode. It relies solely on the [HTML Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API), where you can also find more about browser support.

## Configuration

### fullscreen

| fieldName         | type                         | description                                                                                                                                                         |
|-------------------|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| renderType        | 'iconMenu' \| 'independent'? | Whether the fullscreen button is being rendered independently or as part of the IconMenu. Defaults to 'independent'.                                                |
| targetContainerId | string                       | Specifies the html element on which the fullscreen mode should be applied. If the parameter is omitted, it falls back to the configured global field `containerId`. |

## Store

### State

```js
map.subscribe('plugin/fullscreen/isInFullscreen', (isInFullscreen) => {
  /* Your code. */
})
```

The returned flag indicates whether the MapClient in in fullscreen mode.
