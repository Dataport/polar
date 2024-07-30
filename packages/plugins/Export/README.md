# Export

## Scope

The Export plugin offers users to download the currently visible map canvas in a variety of file formats and by a variety of methods.

## Configuration

### export

| fieldName | type | description |
| --------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| download | boolean? | Whether file is offered for download. By default, no download will happen, and the using service is supposed to register whether a "screenshot" has been taken and react accordingly. |
| showJpg | boolean? | Tools offers current map view as JPG. Defaults to `true`. |
| showPdf | boolean? | Tools offers current map view as PDF. Defaults to `true`. |
| showPng | boolean? | Tools offers current map view as PNG. Defaults to `true`. |

## Store

To remove user control, add `displayComponent: false` to the configuration and use the following interactions.

### Actions

To programmatically trigger a "screenshot", use this action.

```js
// type is 'Png', 'Jpg', or 'Pdf'
map.$store.dispatch('plugin/export/exportAs', type)
```

### State

This shows how a callback can be used to show the exported data in a suitable html element. The value of the `screenshot` variable is a base64-encoded string.

```js
const someElement = // ... however you retrieve your html element
  map.subscribe('plugin/export/exportedMap', (screenshot) =>
    someElement.setAttribute('src', screenshot)
  )
```
