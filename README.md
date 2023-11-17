![Public Money, Public Value](https://img.shields.io/badge/Public%20Money-Public%20Value-red)
[![License: EUPL v1.2](https://img.shields.io/badge/License-EUPL%20v1.2-blue)](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12)
[![We're on NPM!](https://img.shields.io/badge/npm-%F0%9F%9A%80-green)](https://www.npmjs.com/search?q=%40polar)

# POLAR 🗺️

The **Plugins for OpenLAyeRs** library is based on the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi) and [OpenLayers](https://openlayers.org/).

## The Idea 💡

POLAR is built to ease the creation of new map clients: A lot of feature requests in map clients are recurring and can be fulfilled with reusable parts. Then again, many map clients require a _little extra_.

POLAR is built to serve both worlds. For generic use cases, generic clients are ready-made and usable by configuration. More specific use cases can be matched with special clients that still make use of the plugins, but fill in the missing parts right where they belong.

POLAR runs both as full page application and as component. The most common usage is as component: Think of it as a form input where the input data is geospatial.

## Maps 🗺️

The most common use case for this client is in citizen's application processes regarding public service.

Other clients with more specific code (and more visibility) include the [Denkmalkarte Schleswig-Holstein](https://efi2.schleswig-holstein.de/dish/dish_client/index.html), a memorial map, and the [Meldemichel Hamburg](https://static.hamburg.de/kartenclient/prod/), a map to inspect and create reports regarding damages to public infrastructure. The latter is currently being migrated to the version seen in this repository.

## Plugins

|Name|Details|
|-|-|
|[AddressSearch](https://github.com/Dataport/polar/tree/main/packages/plugins/AddressSearch)|Offers a search field and standard search service implementations with API for your own configurable custom search services. Integration with Reverse Geocoder and Pins possible, or usable as a data source for further processing.|
|[Attributions](https://github.com/Dataport/polar/tree/main/packages/plugins/Attributions)|Shows layer copyright information of visible layers.|
|[Draw](https://github.com/Dataport/polar/tree/main/packages/plugins/Draw)|Allows the user to draw various geometries onto the map. The resulting GeoJSON can be forwarded to later processing steps, or be used by the Export plugin to generate screenshots.|
|[Export](https://github.com/Dataport/polar/tree/main/packages/plugins/Export)|Offers screenshot functionality for the user or further processing.|
|[Fullscreen](https://github.com/Dataport/polar/tree/main/packages/plugins/Fullscreen)|User can toggle between integrated and fullscreen view with this plugin.|
|[GeoLocation](https://github.com/Dataport/polar/tree/main/packages/plugins/GeoLocation)|Geolocalizes the user either on user demand or as a background procedure. An icon is shown on the user position on the map.|
|[Gfi](https://github.com/Dataport/polar/tree/main/packages/plugins/Gfi)|Short for "Get Feature Information". Retrieves feature information from a WMS or WFS layer for display or usage by further processing steps.|
|[IconMenu](https://github.com/Dataport/polar/tree/main/packages/plugins/IconMenu)|Handles display of visible plugin buttons. Only relevant for programming clients, no direct user feature.|
|[LayerChooser](https://github.com/Dataport/polar/tree/main/packages/plugins/LayerChooser)|Allows choosing a background layer and an arbitrary amount of feature or overlay layers. WMS layers can optionally be filtered by sub-layers by the user.|
|[Legend](https://github.com/Dataport/polar/tree/main/packages/plugins/Legend)|Displays an overview of layer legend images as delivered by the used WMS services. Images can be clicked for large view.|
|[LoadingIndicator](https://github.com/Dataport/polar/tree/main/packages/plugins/LoadingIndicator)|Loading spinner. Only relevant for programming clients, no direct user feature.|
|[Pins](https://github.com/Dataport/polar/tree/main/packages/plugins/Pins)|Pin feature that allows users to set and move pins to indicate a position. Integration with AddressSearch and ReverseGeocoder configurable.|
|[ReverseGeocoder](https://github.com/Dataport/polar/tree/main/packages/plugins/ReverseGeocoder)|Configurable to translate an arbitrary coordinate to an address. Integration with AddressSearch and Pins configurable.|
|[Scale](https://github.com/Dataport/polar/tree/main/packages/plugins/Scale)|Shows current scale as ratio and size indicator.|
|[Toast](https://github.com/Dataport/polar/tree/main/packages/plugins/Toast)|Shows information to the user. Configurable in many plugins to communicate status updates or procedural advice.|
|[Zoom](https://github.com/Dataport/polar/tree/main/packages/plugins/Zoom)|Allows zooming in and out of the client with buttons.|

## Getting started 🚀

### Using POLAR

Select a client from our [releases](https://github.com/Dataport/polar/releases). For a generic client, use a `@polar/client-afm`. The zipped client is downloadable and attached as an asset to the release.

The package contains example files that illustrate how the client can be used. You may also inspect the example usage [here](https://github.com/Dataport/polar/tree/main/packages/clients/afm/example).

To adapt the client to your use case, change the included `polar-example.js` file, and replace the object used in the `.createMap` call with your configuration. To learn more about configuration options, read the [AfM documentation](https://dataport.github.io/polar/docs/afm/client-afm.html), or the documentation of the client you chose.

### Developing POLAR

Clone the repository and run `npm install && npm run snowbox`. This winds up our development client in a minimal test environment as a starting point.

If you aim to create an additional plugin, you may now create and install it to the snowbox during development. To create a new client, it is advised to create a copy of the AfM client as a base project and adjust it to your needs.

## Roadmap 🛣️

We're production-ready. After a history as Inner Source software, we are now gradually switching to being Open Source software.

| Topic                          | Description                                                                                                                                                                                                                            | Status |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Re-release                     | Offer all packages as 1.0.0 on the NPM registry and as GitHub releases. Previous inner source version history and changelogs are reset.                                                                                         | ✔️     |
| GitHub Actions                 | ~~Linting and testing is done with [husky](https://github.com/typicode/husky) until pipelines are ready.~~ Tests and linting now run in the pipeline. Farewell, husky! 🐺❄️                                                     | ✔️     |
| GitHub Page                    | ~~Create a page offering our full documentation and examples. This includes adapting the internal _snowbox_ client to work as both example and development environment.~~ [Page done.](https://dataport.github.io/polar/) Keeping it up to date is an ongoing effort. | ✔️     |
| Getting started                | A short introduction is available above. We will expand upon this after the following task.                                                                                                                                                                                | 🏗️     |
| Working outside the repository | Clients can be used anywhere, but their development requires further setup. Right now, clients should be developed in this repository or in a fork.                                                                             | ⌛     |
| OSS Best Practices             | Contributions, Issues, Discussions, The Wiki – there's a lot to fill out and define.                                                                                                                                            | ⌛     |

## Stay In Touch 💬

- [Contact us via email 📧](mailto:dataportpolarsupport@dataport.de)

made by [Dataport](https://www.dataport.de/) with ❤️
