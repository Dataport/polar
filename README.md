![Public Money, Public Value](https://img.shields.io/badge/Public%20Money-Public%20Value-red)
[![License: EUPL v1.2](https://img.shields.io/badge/License-EUPL%20v1.2-blue)](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12)
[![We're on NPM!](https://img.shields.io/badge/npm-%F0%9F%9A%80-green)](https://www.npmjs.com/search?q=%40polar)

# POLAR 🗺️

The **Plugins for OpenLAyeRs** library is based on the [masterportalAPI](https://bitbucket.org/geowerkstatt-hamburg/masterportalapi) and [OpenLayers](https://openlayers.org/).

## The Idea 💡

POLAR is built to ease the creation of new map clients: A lot of feature requests in map clients are recurring and can be fulfilled with reusable parts. Then again, many map clients require a _little extra_.

POLAR is built to serve both worlds. For generic use cases, generic clients are ready-made and usable by configuration. More specific use cases can be matched with special clients that still make use of the plugins, but fill in the missing parts right where they belong.

POLAR runs both as full page application and as component. The most common usage is as component: Think of it as a form input where the input data is geospatial.

## Getting started 🚀

Clone the repository and run `npm install && npm run afm:dev`. This winds up our generic client in a minimal test environment. The most common use case for this client is in citizen's application processes regarding public service.

Other clients with more specific code include the [Denkmalkarte Schleswig-Holstein](https://efi2.schleswig-holstein.de/dish/dish_client/index.html), a memorial map, and the [Meldemichel Hamburg](https://static.hamburg.de/kartenclient/prod/), a map to inspect and create reports regarding damages to public infrastructure. The latter is currently being migrated to the version seen in this repository.

This is but a rudimentary start into the POLAR library. We will improve with additional examples, but for now, there's a lot _to do_.

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

- [Contact us via email 📧](mailto:dataport-polar-support@dataport.de)

made by [Dataport](https://www.dataport.de/) with ❤️
