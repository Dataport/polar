# Meldemichel MapClient API 🗺️ `@polar/client-meldemichel`

This client is based on [POLAR](https://github.com/Dataport/polar) and subsequently the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). The following documentation only contains how this specific client can be used, and the minimal information required to get it running.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/meldemichel/client-meldemichel.html).

For the development test deployments, [see here](./example/index.html).

## Basic usage

The NPM package `@polar/client-meldemichel` can be installed via NPM or downloaded from the [release page](https://github.com/Dataport/polar/releases). When using `import mapClient from '@polar/client-meldemichel'`, the object `mapClient` contains a method `createMap`. This is the main method required to get the client up and running. Should you use another import method, check the package's `dist` folder for available files.

The method expects a single object with the following parameters.

| fieldName | type | description |
| - | - | - |
| containerId | string | ID of the container the map is supposed to render itself to. |
| mode | enum["REPORT", "SINGLE", "COMPLETE"] | See chapters below for an overview of the modes. |
| afmUrl | string? | `COMPLETE` mode only. The URL used here is the URL of the AfM service to open to create a new damage report. |
| reportServiceId | string? | `COMPLETE` mode only. ID of the report layer to display. Both the Filter and the Feature List will work with this layer. The client will also provide tooltips and cluster the features. |
| configOverride  | object? | This can be used to override the configuration of any installed plugin; see full documentation. It is also used to set initial pins in `SINGLE` mode. See documentation of `SINGLE` further below. |

It returns a Promise of a map instance. This returned instance is required to retrieve information from the map.

The package also includes a `style.css` and an `index.html` file. The `style.css`'s relative path must, if it isn't the default value `'./style.css'`, be included in the `configOverride` as follows:

```js
{
  // ...
  configOverride: {
    stylePath: '../the/relative/path/style.css'
  }
}
```

The value to `stylePath` is the same as as a `link` tag would have in its `href`.

The `index.html` is used in `COMPLETE` mode, which is not run in the AfM. You may, however, use it for testing or inspecting an example.

### Instance reuse

The `mapInstance` and its HTML environment are kept in the client; it is returned and rerendered on subsequent `createMap` calls to a div with the given `id`. Due to this, everything will appear to the user as it was previously left, including opened menus.

Since in `SINGLE` mode, changes to the pins are required between renders, hence the parameters in `configOverride.pins` are used to update the client. Should additional updates be required, please let us know.

Calling `watch`/`subscribe` on the client will return an `unwatch`/`unsubscribe` method. It should be called on leaving the map's page; depending on framework/library in e.g. the `beforeDestroy` or `beforeUnmount` method.

## Rendering in SINGLE or REPORT mode

A document rendering the map client could e.g. look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>REPORT EXAMPLE</title>
    <style>
      #meldemichel-map-client {
        min-width: 320px;
        max-width: 930px;
        height: 500px;
        position: relative;
        margin: 5px;
        -webkit-box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.5);
        box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.5);
      }
    </style>
  </head>
  <body>
    <div id="meldemichel-map-client">
      <!-- Optional, may use if your page does not have its own <noscript> information -->
      <noscript>Please use a browser with active JavaScript to use the map client.</noscript>
    </div>
    <script type="module">
      import meldemichelMapClient from './client-meldemichel.js'

      const meldemichelMapInstance = await meldemichelMapClient.createMap({
        containerId: 'meldemichel-map-client',
        mode: 'REPORT', // or 'SINGLE',
        // For 'SINGLE' mode where a singular coordinate is inspected/worked on
        configOverride: {
          pins: {
            initial: {
              centerOn: true,
              // The coordinate that is inspected/worked on
              coordinates: [569028, 5932885],
            },
            movable: 'drag', // or 'none' to have an immovable pin
            style: {
              fill: '#0392cf' // or (optionally) '#ff0019' if 'none' is set
            },
          },
        },
      })

      // If an old view state should be set, use this snippet:
      meldemichelMapInstance.$store.dispatch('meldemichel/setMapState', {
        vendor_maps_position: '566167.224436667,5935872.419250831',
        vendor_maps_address_str: 'Alte Rabenstraße',
        vendor_maps_address_hnr: '28',
        mapZoomLevel: 6,
        mapBaseLayer: 452,
        mapCenter: '566808.8386735287,5935896.23173797',
        // NOTE: vendor_maps_distance_to and -_plz are not read
      })

      // to retrieve map state updates, use this snippet:
      const unwatch = mapInstance.$store.watch(
        (_, getters) => getters["meldemichel/mapState"],
        ({
          mapCenter,
          mapZoomLevel,
          mapBaseLayer,
          vendor_maps_position,
          // The following fields are not changed/set in 'SINGLE' mode
          vendor_maps_address_hnr,
          vendor_maps_address_str,
          vendor_maps_address_plz,
          vendor_maps_distance_to
        }) => {
          // do anything with the map values here; example print
          console.info(`MapState Update
            Center coordinate: ${mapCenter}
            Zoom level: ${mapZoomLevel}
            Base layer: ${mapBaseLayer}
            Pin coordinate: ${vendor_maps_position}
            Address: ${vendor_maps_address_str + ' ' + vendor_maps_address_hnr}
            PLZ: ${vendor_maps_address_plz}
            Distance to address: ${vendor_maps_distance_to}`)
        },
        // will return initial values; delete parameter if not desired
        { immediate: true }
      )
    </script>
  </body>
</html>
```

## Rendering COMPLETE mode (full page)

The `index.html` included in the package's `dist` folder has been prepared for this mode and must merely be hosted.

Please see the table in chapter `Basic usage` about configuration options.

## Rendering COMPLETE mode (embedded element)

To embed the COMPLETE mode map on any page, provide a div with an id like `meldemichel-map-client`; you may choose any id you like.

The following script tag can then be used to render the productive services of the Meldemichel map client.

```html
<script type="module">
  // adjust path to where the client is
  import meldemichelMapClient from '../dist/client-meldemichel.js'

  meldemichelMapClient.createMap({
    containerId: 'meldemichel-map-client', // the id you used
    mode: 'COMPLETE',
    afmUrl: `https://afm.hamburg.de/intelliform/forms/mml_melde_michel/standard/mml_melde_michel/index`,
    reportServiceId: '6059',
    configOverride: {
      // adjust path to where the client is
      stylePath: '../dist/style.css'
    }
  })
</script>
```

POLAR will rebuild the given div to contain a ShadowDOM that hosts the map. The outer div will change to have the id `meldemichel-map-client-wrapper` (resp. `${yourId}-wrapper`) and can be used to style the map's height and width with, for example:

```css
#polarstern-wrapper {
  /* "position: relative;" is the minimum required styling */
  position: relative;
  height: 400px;
  width: 100%;
}
```

To also serve users with JS disabled some content, this fragment is common:

```html
<div id="meldemichel-map-client">
  <!-- Optional, may use if your page does not have its own <noscript> information -->
  <noscript>Please use a browser with active JavaScript to use the map client.</noscript>
</div>
```

For a complete example, you may also check [the running embedded scenario](https://dataport.github.io/polar/docs/meldemichel/example/complete_embedded.html) or its [source file](https://github.com/Dataport/polar/blob/main/packages/clients/meldemichel/example/complete_embedded.html).
