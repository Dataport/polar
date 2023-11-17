# Meldemichel MapClient API 🗺️ `@polar/client-meldemichel`

This client is based on [POLAR](https://github.com/Dataport/polar) and subsequently the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). The following documentation only contains how this specific client can be used, and the minimal information required to get it running.

For all additional details, check the [full documentation](https://dataport.github.io/polar/docs/meldemichel/client-meldemichel.html).

For the development test deployments, [see here](./example/index.html).

## Basic usage

The NPM package `@polar/client-meldemichel` can be installed via NPM or downloaded from the [release page](https://github.com/Dataport/polar/releases). When using `import mapClient from '@polar/client-meldemichel'`, the object `mapClient` contains a method `createMap`. This is the main method required to get the client up and running. Should you use another import method, check the package's `dist` folder for available files.

The method expects a single object with the following parameters.

| fieldName       | type                                 | description                                                                                                                                                                                                                                                                             |
| --------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerId     | string                               | ID of the container the map is supposed to render itself to.                                                                                                                                                                                                                            |
| mode            | enum["REPORT", "SINGLE", "COMPLETE"] | See chapters below for an overview of the modes.                                                                                                                                                                                                                                        |
| afmUrl          | string?                              | TODO `COMPLETE` mode only. URL used in the AfM Button.                                                                                                                                                                                                                                         |
| reportServiceId | string?                              | TODO `COMPLETE` mode only. ID of the report layer to display.                                                                                                                                                                                                                                  |
| configOverride  | object?                              | This can be used to override the configuration of any installed plugin; see full documentation. It is also used to set initial pins in `SINGLE` mode. See documentation of `SINGLE` further below. |

It returns a Promise of a map instance. This returned instance is required to retrieve information from the map.

The package also includes a `style.css` and an `index.html` file. The `style.css` must be imported in the following fashion:

```html
<link data-polar="true" href="./style.css" rel="stylesheet" />
```

The `index.html` is used in `COMPLETE` mode, which is not run in the AfM. You may, however, use it for testing or inspecting an example.

## Rendering in SINGLE or REPORT mode

A document rendering the map client could e.g. look like this:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>REPORT EXAMPLE</title>
    <link data-polar="true" href="./style.css" rel="stylesheet" />
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
    <div id="meldemichel-map-client"></div>
    <script type="module">
      import meldemichelMapClient from './client-meldemichel.mjs'

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
      mapInstance.$store.watch(
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

## Rendering COMPLETE mode

The `index.html` included in the package's `dist` folder has been prepared for this mode and must merely be hosted.

// TODO update this block after implementation (TO BE IMPLEMENTED)

```
Dieser [AfMButton] wird dann gerendert, wenn in der mapConf das Feld `afmUrl` befüllt ist, zum Beispiel mit dem String `"https://afm.hamburg.de/intelliform/forms/mml_melde_michel/standard/mml_melde_michel/index"`. Diese URL ist in die Konfiguration gezogen worden, falls sich die Adresse des Prozesses einmal ändern sollte.

Der URL werden folgende Query-Parameter (hier mit Beispielwerten) hinzugefügt:

- `mapCenter=569029.708,5932888.959`
- `mapZoomLevel=9`
- `mapBaseLayer=452`
  - Wert ist ID in der https://geoportal-hamburg.de/lgv-config/services-internet.json
- `vendor_maps_position=569029.708,5932888.959`
- `vendor_maps_address_str=Berlinertordamm`
- `vendor_maps_address_hnr=4`
- `vendor_maps_address_plz=12345`
- `vendor_maps_distance_to=0` (Distanz zum Adresspunkt laut Reverse Geocoder)

Analog liest der Klient im Modus `complete` beim Start auch alle bis auf die letzten zwei Query-Parameter wieder ein. Dabei wird die Adresse überschrieben, falls sie nicht zur `vendor_maps_position` passt.
```
