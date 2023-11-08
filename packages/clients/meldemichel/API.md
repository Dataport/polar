# Meldemichel MapClient API 🗺️ `@polar/client-meldemichel`

This client is based on [POLAR](example.com/TODO) and subsequently the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi/src/master/). Please check the [common POLAR documentation](example.com/TODO) for details. The following documentation only contains how this specific client can be used, and the minimal information required to get it running.

## Basic usage

The NPM package `@polar/client-meldemichel` can be installed via NPM. When using `import mapClient from '@polar/client-meldemichel'`, the object `mapClient` contains a method `createMap`. This is the main method required to get the client up and running. Should you use another import method, check the package's `dist` folder for available files.

The method expects a single object with the following parameters.

| fieldName       | type                                 | description                                                                                                                                                                                                                                                                             |
| --------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerId     | string                               | ID of the container the map is supposed to render itself to.                                                                                                                                                                                                                            |
| mode            | enum["COMPLETE", "SINGLE", "REPORT"] | See chapters below for an overview of the modes.                                                                                                                                                                                                                                        |
| afmUrl          | string?                              | COMPLETE mode only. URL used in the AfM Button.                                                                                                                                                                                                                                         |
| reportServiceId | string?                              | COMPLETE mode only. ID of the report layer to display.                                                                                                                                                                                                                                  |
| configOverride  | object?                              | You will probably not need this object. It is included to override any internal configuration, should the need for quick reconfiguration arise. Please refer to the general documentation on what can be done here. If you need it, please communicate back with us what the issue was. |

It returns a Promise of a map instance. This returned instance is required to retrieve information from the map.

The package also includes a `style.css` and an `index.html` file. The `style.css` must be imported in the following fashion:

```html
<link data-polar="true" href="./style.css" rel="stylesheet" />
```

The `index.html` is used in COMPLETE mode, which is not run in the AfM. You may, however, use it for testing.

## Rendering COMPLETE mode

The `index.html` included in the package's `dist` folder has been prepared for this mode and must merely be hosted.

// TODO translate after implementation (details might change)

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
- `vendor_maps_address_to=0` (Entfernung zum Hit im Falle von )

Analog liest der Klient im Modus `complete` beim Start auch alle bis auf die letzten zwei Query-Parameter wieder ein. Dabei wird die Adresse überschrieben, falls sie nicht zur `vendor_maps_position` passt.

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
    <p>Communicated data:</p>
    <p>Coordinates: <span id="test-display-coordinate">null</span></p>
    <p>Address: <span id="test-display-address">null</span></p>
    <p>Address data: <span id="test-display-address-data">null</span></p>
    <script type="module">
      import meldemichelMapClient from './client-meldemichel.mjs'
      meldemichelMapClient.createMap({
        containerId: 'meldemichel-map-client',
        mode: 'REPORT', // or 'SINGLE'
        // TODO additional parameters
      })

      // TODO example of subscribing to store values and putting them in the paragraphs above
    </script>
  </body>
</html>
```

### report

// TODO translate after implementation (details might change)

Der Reportmodus ist für die Verwendung im AfM gedacht. In diesem Modus fehlen alle bereits existierenden Meldungen, d.h. die Karte beinhält keine Schäden und keine dazugehörigen Elemente Filter, Meldungstoggler, Liste. Ebenso wird der Button "Neues Anliegen" nicht angezeigt. Dieser Modus wird mit dem Schlüsselwertpaar `mode: 'report'` in der `mapConf` hergestellt. Die Angabe der `reportLayerId` und des entsprechenden Eintrags in `overlays` und `attributions` muss in diesem Fall entfernt werden.

Previously supplied map client values can be used to reconstruct a previous view.

```js
import meldemichelMapClient from '@polara/client-meldemichel'

const mapInstance = await meldemichelMapClient.createMap({
  // ... see `createMap` description
})

mapInstance.$store.dispatch('meldemichel/setMapState', {
  vendor_maps_position: '566167.224436667,5935872.419250831',
  vendor_maps_address_str: 'Alte Rabenstraße',
  vendor_maps_address_hnr: '28',
  mapZoomLevel: '4',
  mapBaseLayer: '453',
  mapCenter: '566808.8386735287,5935896.23173797',
})
```

### single

// TODO translate after implementation (details might change)

In diesem Modus wird nur ein einzelnes Feature angezeigt und ist, je nach Berechtigung, bearbeitbar. Der Feature-Umfang ist stark reduziert; verfügbar sind die FullScreen-Funktion, Zoom-In/Out, der Vermerk rechtlicher Hinweise, und Marker-Features.

Die `mapConf` kann wegen des stark reduzierten Umfangs dann zum Beispiel so aussehen:

```js
var mapConf = {
  mode: 'single', // aktueller Modus
  editable: true, // neu // TODO the field in Pins is called "movable"
  pinCoordinate: [565699.2, 5933923.69], // neu
  boundaryLayerId: '6074',
  baseLayers: [
    { id: '453', displayName: 'mcapi.meldemichel.layer.cityplan' },
    { id: '452', displayName: 'mcapi.meldemichel.layer.aerial' },
  ],
  overlays: [
    {
      id: '6074',
      controllable: false,
      visibility: false,
      displayName: 'mcapi.meldemichel.layer.hamburgBorder',
    },
  ],
  attributions: {
    453: 'mcapi.meldemichel.attribution.cityplan',
    452: 'mcapi.meldemichel.attribution.aerial',
  },
}
```

Wenn die `pinSpecification` (wie im Beispiel) fehlt, werden die Farben in Abhängigkeit vom Flag `editable` mit weißer Umrandung und Füllfarbe `editable ? '#ff0019' : '#0392cf'` hergestellt; ebenso wird das Flag `isMovable` auf den Wert von `editable` gesetzt. Die `pinSpecification` kann weiterhin auch selbst übergeben werden. Dann ist es erforderlich, das Flag `isMovable` auch selbst zu setzen. Von diesem abhängig ist, ob der Pin beweglich ist, es muss also den Wert von `editable` haben.

- `editable`: Wenn hier true gesetzt wird, erscheint der Marker rot und ist beweglich. Ansonsten ist er blau und unbeweglich. (Wie zuvor beschrieben überschreibbar.) Das Flag muss gesetzt werden. Beweglichkeit umfasst auch das Klicken an eine neue Stelle innerhalb der Karte.
- `pinCoordinate`: Die Karte bezieht keinen Meldungslayer mehr, sondern zeigt nur eine einzelne Meldung. Die initiale Position des Markers muss hiermit übergeben werden. Aktualisierungen lassen sich wie sonst auch beziehen.

Wenn der Pin verändert wird, wird wie bisher intern ein Reverse Geocoding angestoßen und das Ergebnis in den Store geschrieben.

Zur Adresssuche kann direkt die Suchfunktion der masterportalAPI verwendet werden, die unter http://141.91.163.211/mcapi/docs/module-core_masterportalAPI.html#.exports.search dokumentiert ist. Von den `searchX`-Flags sollten bei der Adresssuche `searchAddress`, `searchStreets`, und `searchHouseNumbers` auf `true` gesetzt werden.

Um eine Koordinate, die sich aus der Suche ergibt, in der Karte zu setzen und zu zentrieren, kann folgendes Snippet verwendet werden.

```js
window.mapInstance.plugins.pin.control.element.inputCoordinate([
  567889.7183395522, 5934312.142969829,
])
window.mapInstance.getView().setCenter([567889.7183395522, 5934312.142969829])
window.mapInstance.getView().setZoom(8)
```

## Localization

The map client is fully prepared for localization, and all visible text that does not come from external services can be overwritten. Please see the general documentation from the initial chapter for details.
