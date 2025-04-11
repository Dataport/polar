# Getting Started (for Developers)

Welcome to POLAR! This guide will walk you through the initial steps of installation and development with POLAR, with a particular focus on using plugins.

## 1. Overview

POLAR is a versatile package library that allows you to develop your own map projects using clients and plugins. This guide will show you how to use the Snowbox client and how to integrate plugins into your project.

## 2. Quick Start with the POLAR Client

### Step 1: Choose Your Installation Method

You have two options to get started with the POLAR client:

#### 1. Using the NPM Package

- If your project uses NPM, you can install the generic map client via the @polar/client-generic package. Its usage is further illustrated on our [documentation page](https://dataport.github.io/polar/).

#### 2. Using Pre-built Releases

- If your project does not use NPM, you can download a pre-built client from our [releases](https://github.com/Dataport/polar/releases). In each release, the zipped client is available as an attached asset and can be downloaded directly.

### Step 2: Download and Installation

#### For NPM Users:

- Install the package via NPM:

```bash
npm install @polar/client-generic
```

#### For Non-NPM Users:

- Download the desired client from the [releases](https://github.com/Dataport/polar/releases) and unzip it.
  The unzipped files contain example projects and documentation that will help you get started.

## 3. Developing with POLAR

### Clone the Repository and Set Up the Environment

1. Clone the POLAR repository:
   ```bash
   git clone https://github.com/Dataport/polar.git
   ```
2. Install the dependencies and start the development environment:
   ```bash
   npm install && npm run snowbox
   ```
   > This winds up our development client in a minimal test environment as a starting point.

## 4. Integrating and Using Plugins in POLAR

### 4.1 Overview of the Plugins and the addPlugins Mechanism

POLAR utilizes a modular plugin system that allows you to extend the functionality of your map application. The addPlugins function is central to integrating plugins into your project. In this section, we'll explain how to use the addPlugins mechanism to add and configure plugins in your application.

### 4.2 Adding Plugins to Your Project

The `package.json` file of the Snowbox client already lists all available plugins as `devDependencies`. To use a plugin in your project, ensure that it is installed in your development environment.Clients run anywhere, but their development requires further setup. Right now, clients should be developed in this repository or in a fork of it to make use of its setup.

To add new plugins or activate existing ones, edit the `package.json` and add the desired plugin if it is not already present. When developing an unpublished plugin, use the path to your local plugin to ensure it is recognized by the client.

Then, reinstall the dependencies:

```bash
npm install
```

### 4.3 Configuring Plugins in addPlugins.ts

The addPlugins.ts file defines the addPlugins function, which integrates multiple plugins into the map application. Here's how you can configure and add plugins:

Example of addPlugins.ts

```typescript
import merge from 'lodash.merge'
import { setLayout, NineLayout, NineLayoutTag } from '@polar/core'
// Import all the necessary plugins
import AddressSearch from '@polar/plugin-address-search'
import Attributions from '@polar/plugin-attributions'
import Draw from '@polar/plugin-draw'
import Export from '@polar/plugin-export'
import Fullscreen from '@polar/plugin-fullscreen'
import GeoLocation from '@polar/plugin-geo-location'
import IconMenu from '@polar/plugin-icon-menu'
import LayerChooser from '@polar/plugin-layer-chooser'
import Legend from '@polar/plugin-legend'
import LoadingIndicator from '@polar/plugin-loading-indicator'
import Pins from '@polar/plugin-pins'
import ReverseGeocoder from '@polar/plugin-reverse-geocoder'
import Scale from '@polar/plugin-scale'
import Toast from '@polar/plugin-toast'
import Zoom from '@polar/plugin-zoom'

const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
}

export const addPlugins = (core) => {
  setLayout(NineLayout)

  // Define the iconMenu that groups several plugins
  const iconMenu = IconMenu({
    menus: [
      {
        plugin: LayerChooser({}),
        icon: 'fa-layer-group', // Icon for the plugin in the menu
        id: 'layerChooser',
      },
      {
        plugin: Draw({}),
        icon: 'fa-pencil', // Icon for the plugin
        id: 'draw',
      },
      {
        plugin: Zoom({ renderType: 'iconMenu' }),
        id: 'zoom',
      },
      {
        plugin: Fullscreen({ renderType: 'iconMenu' }),
        id: 'fullscreen',
      },
      {
        plugin: GeoLocation({ renderType: 'iconMenu' }),
        id: 'geoLocation',
      },
      {
        plugin: Attributions({
          renderType: 'iconMenu',
          listenToChanges: [
            'plugin/zoom/zoomLevel',
            'plugin/layerChooser/activeBackgroundId',
            'plugin/layerChooser/activeMaskIds',
          ],
        }),
        icon: 'fa-regular fa-copyright',
        id: 'attributions',
      },
    ],
    displayComponent: true, // The IconMenu will be displayed on the map
    initiallyOpen: 'layerChooser', // Specifies which menu is open by default
    layoutTag: NineLayoutTag.TOP_RIGHT,
  })

  // Adding all plugins to the map instance
  core.addPlugins([
    AddressSearch(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.TOP_LEFT,
        addLoading: 'plugin/loadingIndicator/addLoadingKey',
        removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      })
    ),
    iconMenu,
    Export(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_LEFT,
      })
    ),
    LoadingIndicator(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.MIDDLE_MIDDLE,
      })
    ),
    Legend({
      displayComponent: true,
      layoutTag: NineLayoutTag.BOTTOM_RIGHT,
    }),
    Scale(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_RIGHT,
      })
    ),
    Toast(
      merge({}, defaultOptions, {
        layoutTag: NineLayoutTag.BOTTOM_MIDDLE,
      })
    ),
    Pins({
      appearOnClick: { show: true, atZoomLevel: 6 },
      coordinateSource: 'plugin/addressSearch/chosenAddress',
      toastAction: 'plugin/toast/addToast',
    }),
    ReverseGeocoder({
      url: 'https://geodienste.hamburg.de/HH_WPS',
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
      coordinateSource: 'plugin/pins/transformedCoordinate',
      addressTarget: 'plugin/addressSearch/selectResult',
      zoomTo: 7,
    }),
  ])
}
```

#### Understanding the Configuration

- Import Plugins: Begin by importing all the plugins you wish to use.
- Configure Plugins: Each plugin is configured with options like layoutTag, displayComponent, and other plugin-specific settings.
- Add Plugins: Use core.addPlugins([...]) to add the configured plugins to the map.
- Set Layout: The `NineLayout` system provides a structured and flexible way to display plugins in a 3x3 grid (nine sections) on the map within your application.

### 4.4 Integrating Plugins into mapConfiguration.ts and polar-client.ts

#### mapConfiguration.ts

The mapConfiguration.ts file serves as the central configuration point for your map application, defining settings such as projection systems, language, and theme configuration using Vuetify.

```typescript
export const mapConfiguration = {
  language: 'en',
  epsg: 'EPSG:25832',
  // Other configurations like locales, vuetify themes, layers, etc.
}
```

#### polar-client.ts

In polar-client.ts, you initialize the POLAR core instance, invoke the addPlugins function, and set up the map with the configuration from mapConfiguration.ts.

```typescript
import polarCore from '@polar/core'
import { addPlugins } from './addPlugins'
import { mapConfiguration } from './mapConfiguration'

addPlugins(polarCore)

const createMap = (layerConf) => {
  polarCore
    .createMap({
      containerId: 'polarstern',
      mapConfiguration: {
        ...mapConfiguration,
        layerConf,
      },
    })
    .then(addStoreSubscriptions(/* subscription logic */))
}

/* Initializes the layer list and creates the map instance.
 * This becomes obsolete if a local service register is used.
 * In that case, that service register can be directly used as `layerConf` on the `createMap` call.
 */
polarCore.rawLayerList.initializeLayerList(
  'https://geodienste.hamburg.de/services-internet.json',
  createMap
)
```

### 4.5 Best Practices for Integrating Plugins

- Centralized Configuration: Manage the primary map settings in mapConfiguration.ts for easy maintenance.
- Modular Plugin Management: Use addPlugins.ts to separate plugin configurations, allowing for easier updates and modifications.
- Testing: Regularly test your integrated plugins in the Snowbox environment to ensure compatibility and functionality.

## Conclusion

Congratulations! You have now completed the Getting Started guide for POLAR. You should now have a solid understanding of how to set up and work with the POLAR package library, integrate and configure plugins, and customize your map application to fit your project's needs.

### Next Steps

- Explore More Plugins: Experiment with different configurations.
- Develop Custom Plugins: Extend POLAR's capabilities.
- Contribute: Help improve the POLAR project.

Enjoy Building with POLAR! 🎉
