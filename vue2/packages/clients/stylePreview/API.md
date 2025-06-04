# POLAR StylePreview client

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/stylePreview/client-stylePreview.html).

For our example client, [see here](./example/prod-example.html).

## Setup

### Start

Run e.g. the following lines to get the client running:

```js
import MapClient from "@polar/client-style-preview"

const servicesUrl = 'https://geodienste.hamburg.de/services-internet.json'

MapClient.rawLayerList.initializeLayerList(servicesUrl, (layerConf) =>
  MapClient
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration, // see client docs for full info
        layerConf,
      },
    })
    .then((mapInstance) => {
      // run mapInstance.updateStyles(nextStyle) to update map style; see docs below
    })
)
```

### Teardown

Run `mapInstance.$destroy()` on unmount. All registered subscriptions need to be undone by calling the `un-` method returned by subscription calls. See `@polar/core` docs chapter "Teardown" for additional information.

### updateStyles

This expects an object of the following format:

```json
{
  "point": { /* ... */ },
  "lineString": { /* ... */ },
  "polygon": { /* ... */ },
  "text": { /* ... */ }
}
```

The nested objects are the parameter objects to the [OpenLayers Style Class](https://openlayers.org/en/latest/apidoc/module-ol_style_Style-Style.html) with a twist: All class indicators that are met on the way will be constructed. (For implemented cases, that is.)

For example,

```json
{
  "polygon": {
    "fill": {
      "color": "#000000"
    }
  }
}
```

will produce the following style for polygons:

```js
new Style({
  fill: new Fill({
    color: '#000000'
  })
})
```

The following keys are implemented classes:

* `Fill` (from `"fill"` key)
* `Stroke` (from `"stroke"` key)
* `Text` (from `"text"` key)

Sometimes, multiple classes may fit.

* `"imageCircle"` will create a `Circle` class instance in the `"image"` key
* `"imageIcon"` will create an `Icon` class instance in the `"image"` key

Also, there are hatches for polygons that can be used in `Fill`.

```json
{
  "polygon": {
    "fill": {
      "hatch": { /* hatchParams */ }
    }
  }
}
```

will be turned into

```js
new Style({
  fill: new Fill({
    // Hatch returns renderable color in OL's sense
    color: new Hatch({ /* hatchParams */ })
  })
})
```

The [hatch parameters](https://bitbucket.org/geowerkstatt-hamburg/masterportal/src/dev/docs/User/Global-Config/style.json.md#polygonpolygonfillhatch) are defined in the Masterportal documentation.
