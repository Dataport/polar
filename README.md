![Public Money, Public Value](https://img.shields.io/badge/Public%20Money-Public%20Value-red)
[![License: EUPL v1.2](https://img.shields.io/badge/License-EUPL%20v1.2-blue)](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12)
[![We're on NPM!](https://img.shields.io/badge/npm-%F0%9F%9A%80-green)](https://www.npmjs.com/search?q=%40polar)

<h1 align="center"><img alt="POLAR" height="80px" src="./pages/assets/iceberg.svg" /></h1>

**Plugins for OpenLAyeRs** is based on the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi) and [OpenLayers](https://openlayers.org/).

POLAR is ...

* ... a configurable map client package.
* ... a flexible map client factory.
* ... an extensible library.

## Quick Start

Usage without NPM documented in chapter "Getting started (for developers)".

```bash
npm i @polar/client-generic
```

```js
import polar from '@polar/client-generic'

polar.createMap({
  // a div must have this id
  containerId: 'polarstern',
  // any service register – this is Hamburg's
  services: 'https://geodienste.hamburg.de/services-internet.json',
  mapConfiguration: {
    // this initially shows Hamburg's city plan
    layers: [{
      id: '453',
      visibility: true,
      type: 'background',
    }]
  }
})
```

See our [documentation page](https://dataport.github.io/polar/) for all features and configuration options included in this modulith client, with running examples.

## Example clients

The most common use case for this client is in citizen's application processes regarding public service.

Other clients with more specific code include the [Denkmalkarte Schleswig-Holstein](https://efi2.schleswig-holstein.de/dish/dish_client/index.html), a memorial map, and the [Meldemichel Hamburg](https://static.hamburg.de/kartenclient/prod/), a map to inspect and create reports regarding damages to public infrastructure. The latter is currently being migrated to the version seen in this repository.

## Backers and users

### States of Germany

<table align="center">
  <tr align="center">
    <td align="center"><img src="./pages/assets/landessymbole/bremen.svg" alt="Bremer Wappenzeichen" height="120px" style="object-fit: contain;"><div>Freie Hansestadt Bremen</div></td>
    <td align="center"><img src="./pages/assets/landessymbole/hamburg.svg" alt="Hamburg-Symbol" height="120px" style="object-fit: contain;"><div>Freie und Hansestadt Hamburg</div></td>
  </tr>
  <tr align="center">
    <td align="center"><img src="./pages/assets/landessymbole/sachsen-anhalt.svg" alt="Landessymbol Sachsen-Anhalt" height="120px" style="object-fit: contain;"><div>Sachsen-Anhalt</div></td>
    <td align="center"><img src="./pages/assets/landessymbole/schleswig-holstein.svg" alt="Landessymbol Schleswig-Holstein" height="120px" style="object-fit: contain;"><div>Schleswig-Holstein</div></td>
  </tr>
</table>

### Government agencies

* [Senatskanzlei Hamburg](https://www.hamburg.de/senatskanzlei/)
* [Landesamt für Denkmalpflege Schleswig-Holstein](https://www.schleswig-holstein.de/DE/landesregierung/ministerien-behoerden/LD/ld_node.html)
* [Dataport AöR](https://www.dataport.de/)

## Technical concepts

### Reusability *and* adaptability

POLAR is built to ease the creation of new map clients. A lot of feature requests in map clients are recurring and can be fulfilled with reusable parts. Then again, many map clients require a _little extra_.

POLAR is built to serve both worlds. For generic use cases, generic clients are ready-made and usable by configuration. More specific use cases can be matched with special clients that still make use of the plugins and fill in the missing parts.

POLAR runs both as full page application and as component. The most common usage is as component: Think of it as a form input where the input data is geospatial.

### Plugin-based approach

To see our plugins in action, please visit our [documentation page](https://dataport.github.io/polar/) to see running examples. Plugins are designed to be configurable, optional, and replacable.

|Name|Details|
|-|-|
|[AddressSearch](https://github.com/Dataport/polar/tree/main/packages/plugins/AddressSearch)|Offers a search field and standard search service implementations with API for your own configurable custom search services. For already usable search services, see the documentation of the package. Integration with Reverse Geocoder and Pins possible, or usable as a data source for further processing.|
|[Attributions](https://github.com/Dataport/polar/tree/main/packages/plugins/Attributions)|Shows layer copyright information of visible layers and client.|
|[Draw](https://github.com/Dataport/polar/tree/main/packages/plugins/Draw)|Allows the user to draw various geometries onto the map. The resulting GeoJSON can be forwarded to later processing steps, or be used by the Export plugin to generate screenshots.|
|[Export](https://github.com/Dataport/polar/tree/main/packages/plugins/Export)|Offers screenshot functionality for the user or further processing.|
|[Filter](https://github.com/Dataport/polar/tree/main/packages/plugins/Filter)|Allows users to filter vector layers to content relevant to their interests.|
|[Fullscreen](https://github.com/Dataport/polar/tree/main/packages/plugins/Fullscreen)|User can toggle between integrated and fullscreen view with this plugin.|
|[GeoLocation](https://github.com/Dataport/polar/tree/main/packages/plugins/GeoLocation)|Geolocalizes the user either on user demand or as a background procedure. An icon is shown on the user position on the map.|
|[Gfi](https://github.com/Dataport/polar/tree/main/packages/plugins/Gfi)|Short for "Get Feature Information". Retrieves feature information from a WMS or WFS layer for display or usage by further processing steps. Can be used as feature list viewer for vector layers.|
|[IconMenu](https://github.com/Dataport/polar/tree/main/packages/plugins/IconMenu)|Handles display of visible plugin buttons. Only relevant for programming clients, no direct user feature.|
|[LayerChooser](https://github.com/Dataport/polar/tree/main/packages/plugins/LayerChooser)|Allows choosing a background layer and an arbitrary amount of feature or overlay layers. WMS layers can optionally be filtered by sub-layers by the user.|
|[Legend](https://github.com/Dataport/polar/tree/main/packages/plugins/Legend)|Displays an overview of layer legend images as delivered by the used WMS services. Images can be clicked for large view.|
|[LoadingIndicator](https://github.com/Dataport/polar/tree/main/packages/plugins/LoadingIndicator)|Loading spinner. Only relevant for programming clients, no direct user feature.|
|[Pins](https://github.com/Dataport/polar/tree/main/packages/plugins/Pins)|Pin feature that allows users to set and move pins to indicate a position. Integration with AddressSearch and ReverseGeocoder configurable.|
|[ReverseGeocoder](https://github.com/Dataport/polar/tree/main/packages/plugins/ReverseGeocoder)|Configurable to translate an arbitrary coordinate to an address. Integration with AddressSearch and Pins configurable.|
|[Scale](https://github.com/Dataport/polar/tree/main/packages/plugins/Scale)|Shows current scale as ratio and size indicator.|
|[Toast](https://github.com/Dataport/polar/tree/main/packages/plugins/Toast)|Shows information to the user. Configurable in many plugins to communicate status updates or procedural advice.|
|[Zoom](https://github.com/Dataport/polar/tree/main/packages/plugins/Zoom)|Allows zooming in and out of the client with buttons.|

## Getting started (for developers)

For a detailed step-by-step guide, please refer to our comprehensive [Getting Started guide](https://github.com/Dataport/polar/tree/main/gettingStarted.md).

## Stay In Touch

- [Contact us via email 📧](mailto:dataportpolarsupport@dataport.de)

made by [Dataport](https://www.dataport.de/) with ❤️
