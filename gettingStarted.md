# Getting Started (for Developers)

Welcome to POLAR! This guide will walk you through the initial steps of installation and development with POLAR, with a particular focus on using plugins.

## 1. Overview

POLAR is a versatile package that allows you to develop your own map projects using clients and plugins. This guide will show you how to use the Snowbox client and how to integrate plugins into your project.

## 2. Quick Start with the POLAR Client

### Step 1: Check Your Requirements
- First check if the generic map client fulfills your need. The @polar/client-generic package's use is furthermore illustrated on our [documentation page](https://dataport.github.io/polar/). 
- Should your project not use NPM, you may also select a client from our [releases](https://github.com/Dataport/polar/releases). On all client releases, the zipped client is downloadable and attached as an asset to the release.

### Step 2: Download and Installation
- Download the desired client from the releases and unzip it.
- The unzipped files contain example projects and documentation that will help you get started.

## 3. Developing with POLAR

### Step 1: Clone the Repository and Set Up the Environment
1. Clone the POLAR repository:
   ```bash
   git clone https://github.com/Dataport/polar.git
   ```
2. Install the dependencies and start the development environment:
   ```bash
   npm install && npm run snowbox
   ```
   > This winds up our development client in a minimal test environment as a starting point.

## 4. Using Plugins in the Snowbox Client

### 4.1 Overview of the Plugins

The Snowbox client supports various plugins that are defined in the `package.json`. The available plugins include:
- `@polar/plugin-address-search`
- `@polar/plugin-draw`
- `@polar/plugin-fullscreen`
- `@polar/plugin-geo-location`
- `@polar/plugin-legend`
- ... and many more.

These plugins extend the functionality of the Snowbox client and provide features like address search, drawing on the map, fullscreen support, geolocation, etc.

### 4.2 Adding Plugins

The `package.json` file of the Snowbox client already lists all available plugins as `devDependencies`. To use a plugin in your project, ensure that it is installed in your development environment.

To add new plugins or activate existing ones, edit the `package.json` and add the desired plugin if it is not already present. When developing an unpublished plugin, use the path to your local plugin to ensure it is recognized by the client.

Clients run anywhere, but their development requires further setup. Right now, clients should be developed in this repository or in a fork of it to make use of its setup.

Then, reinstall the dependencies:
```bash
npm install
```

### 4.3 Using Plugins in Code – Detailed Explanation

The provided `addPlugins.ts` file defines the `addPlugins` function, which integrates multiple plugins into the map application. Let’s break down the code and explain how each plugin is integrated and what configuration options are available.

#### Overview of the `addPlugins` Function

The `addPlugins` function expects a `core` object as a parameter. This `core` object represents the main instance of the POLAR application and provides methods to add plugins.

```typescript
export const addPlugins = (core) => {
  setLayout(NineLayout);
  // Adding the iconMenu plugin and other plugins
  core.addPlugins([ /* List of Plugins */ ]);
}
```

#### Configuration of the `iconMenu` Plugin

The `iconMenu` plugin serves as a central menu for displaying and accessing other plugins. It is configured with a list of menu entries, each embedding another plugin.

```typescript
const iconMenu = IconMenu({
  menus: [
    {
      plugin: LayerChooser({}), // Layer chooser plugin
      icon: 'fa-layer-group',   // Icon for the plugin in the menu
      id: 'layerChooser',
    },
    {
      plugin: Draw({}),         // Drawing plugin
      icon: 'fa-pencil',        // Icon for the plugin
      id: 'draw',
    },
    {
      plugin: Zoom({ renderType: 'iconMenu' }), // Zoom plugin
      id: 'zoom',
    },
    {
      plugin: Fullscreen({ renderType: 'iconMenu' }), // Fullscreen plugin
      id: 'fullscreen',
    },
    {
      plugin: GeoLocation({ renderType: 'iconMenu' }), // Geolocation plugin
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
  displayComponent: true,     // The IconMenu will be displayed on the map
  initiallyOpen: 'layerChooser', // Specifies which menu is open by default
  layoutTag: NineLayoutTag.TOP_RIGHT, // Position of the iconMenu on the map
});
```

#### Adding Plugins to the Map

The `core.addPlugins` method is used to add the list of plugins to the map application. Here’s a detailed look at some of these plugins:

```typescript
core.addPlugins([
  AddressSearch(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.TOP_LEFT, // Position of the plugin on the map
      addLoading: 'plugin/loadingIndicator/addLoadingKey',
      removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
    })
  ),
  iconMenu,
  Export(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_LEFT, // Position of the export plugin
    })
  ),
  LoadingIndicator(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.MIDDLE_MIDDLE, // Position of the loading indicator
    })
  ),
  Legend({
    displayComponent: true,
    layoutTag: NineLayoutTag.BOTTOM_RIGHT, // Position of the legend
  }),
  Scale(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_RIGHT, // Position of the scale
    })
  ),
  Toast(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.BOTTOM_MIDDLE, // Position of the toast messages
    })
  ),
  Pins({
    appearOnClick: { show: true, atZoomLevel: 6 }, // Configuration for the pins on the map
    coordinateSource: 'plugin/addressSearch/chosenAddress',
    toastAction: 'plugin/toast/addToast',
  }),
  Gfi(
    merge({}, defaultOptions, {
      layoutTag: NineLayoutTag.MIDDLE_LEFT, // Position of the GFI plugin
    })
  ),
  ReverseGeocoder({
    url: 'https://geodienste.hamburg.de/HH_WPS',
    addLoading: 'plugin/loadingIndicator/addLoadingKey',
    removeLoading: 'plugin/loadingIndicator/removeLoadingKey',
    coordinateSource: 'plugin/pins/transformedCoordinate',
    addressTarget: 'plugin/addressSearch/selectResult',
    zoomTo: 7,
  }),
]);
```

## 5. Integrating Plugins into mapConfiguration.ts

The `mapConfiguration.ts` file serves as the central configuration point for your map application, providing a comprehensive structure for defining how your map should look and behave. This file, in combination with `addPlugins.ts` and `polar-client.ts`, integrates and manages various plugins within the POLAR framework.

### 5.1 Basic Structure of mapConfiguration.ts

Initially, the `mapConfiguration.ts` file starts with foundational settings for the map, such as projection systems, language settings, and the theme configuration using Vuetify. It also sets up layers, address search, drawing options, and other components that influence how the map and its plugins function. Here's an excerpt of the core configuration:

``` Typescript
export const mapConfiguration = {
  language: 'en',
  epsg: 'EPSG:25832',
  locales: language,
  vuetify: {
    theme: {
      themes: {
        light: {
          primary: somewhatBlue,
          primaryContrast: notQuiteWhite,
          secondary: eigengrau,
          secondaryContrast: notQuiteWhite,
        },
      },
    },
  },
  // Other map configurations like namedProjections, addressSearch, layers, etc.
};
```

### 5.2 Adding Plugins Using addPlugins.ts
The `addPlugins.ts` file is used to define and manage the integration of plugins into your map instance. The addPlugins function accepts the `core` instance and sets up the layout for the map using `setLayout(NineLayout)`. Plugins such as `AddressSearch`, `GeoLocation`, `Legend`, and `Scale` are imported and added to the map with specific configurations.
Structure of `addPlugins.ts`:

```typescript
import merge from 'lodash.merge';
import { setLayout, NineLayout, NineLayoutTag } from '@polar/core';
// Import all the necessary plugins
import AddressSearch from '@polar/plugin-address-search';
import Attributions from '@polar/plugin-attributions';
import Draw from '@polar/plugin-draw';
import Export from '@polar/plugin-export';
import Fullscreen from '@polar/plugin-fullscreen';
import GeoLocation from '@polar/plugin-geo-location';
import IconMenu from '@polar/plugin-icon-menu';
import LayerChooser from '@polar/plugin-layer-chooser';
import Legend from '@polar/plugin-legend';
import Scale from '@polar/plugin-scale';
import Toast from '@polar/plugin-toast';
import Zoom from '@polar/plugin-zoom';

// Default configuration for plugins
const defaultOptions = {
  displayComponent: true,
  layoutTag: NineLayoutTag.TOP_LEFT,
};

export const addPlugins = (core) => {
  setLayout(NineLayout);

  // Define the iconMenu that groups several plugins
  const iconMenu = IconMenu({
    menus: [
      { plugin: LayerChooser({}), icon: 'fa-layer-group', id: 'layerChooser' },
      { plugin: Draw({}), icon: 'fa-pencil', id: 'draw' },
      { plugin: Zoom({ renderType: 'iconMenu' }), id: 'zoom' },
      { plugin: Fullscreen({ renderType: 'iconMenu' }), id: 'fullscreen' },
      { plugin: GeoLocation({ renderType: 'iconMenu' }), id: 'geoLocation' },
      {
        plugin: Attributions({ renderType: 'iconMenu', listenToChanges: ['plugin/zoom/zoomLevel', 'plugin/layerChooser/activeBackgroundId'] }),
        icon: 'fa-regular fa-copyright',
        id: 'attributions',
      },
    ],
    layoutTag: NineLayoutTag.TOP_RIGHT,
    displayComponent: true,
    initiallyOpen: 'layerChooser',
  });

  // Adding all plugins to the map instance
  core.addPlugins([
    AddressSearch(merge({}, defaultOptions, { layoutTag: NineLayoutTag.TOP_LEFT })),
    iconMenu,
    Export(merge({}, defaultOptions, { layoutTag: NineLayoutTag.BOTTOM_LEFT })),
    Legend({ displayComponent: true, layoutTag: NineLayoutTag.BOTTOM_RIGHT }),
    Scale(merge({}, defaultOptions, { layoutTag: NineLayoutTag.BOTTOM_RIGHT })),
    Toast(merge({}, defaultOptions, { layoutTag: NineLayoutTag.BOTTOM_MIDDLE })),
  ]);
};
```

### 5.3 Integrating the Plugins into the Application via polar-client.ts
The `polar-client.ts` file ties everything together. It initializes the POLAR `core` instance, invokes the `addPlugins` function, and sets up the map with the defined configuration from `mapConfiguration.ts`.

```Typescript
import polarCore from '@polar/core';
import { addPlugins } from './addPlugins';
import { mapConfiguration } from './mapConfiguration';

addPlugins(polarCore);

const createMap = (layerConf) => {
  polarCore.createMap({
    containerId: 'polarstern',
    mapConfiguration: {
      ...mapConfiguration,
      layerConf,
    },
  }).then(addStoreSubscriptions(/* subscription logic */));
};

// Initializes the layer list and creates the map instance
polarCore.rawLayerList.initializeLayerList('https://geodienste.hamburg.de/services-internet.json', createMap);
```

### 5.4 Explanation of the Plugin Integration Process
The process is as follows:

  - `mapConfiguration.ts` defines the `core` settings and appearance of the map.
  - `addPlugins.ts` handles the instantiation and configuration of individual plugins, utilizing `addPlugins(core)` to add them to the `core` instance.
  - `polar-client.ts` combines these configurations to initialize and render the map, ensuring the plugins are integrated and functioning within the defined layout.

### 5.5 Best Practices for Integrating Plugins
- Centralized Configuration: Manage the primary map settings in mapConfiguration.ts for easy maintenance.
- Modular Plugin Management: Use addPlugins.ts to separate plugin configurations, allowing for easier updates and modifications.
- Testing: Regularly test your integrated plugins in the Snowbox environment to ensure compatibility and functionality.

## 6. Using the Layout – The `NineLayout` System

The `NineLayout` is a flexible layout system that allows plugins to be placed in a 3x3 grid (nine sections) on the map.

### 6.1 How `NineLayout.vue` Works

`NineLayout.vue` is the Vue component that represents the layout of the map and places plugins according to their configured positions.

```vue
<template>
  <div class="wrapper">
    <div
      v-for="(tag, index) of tags"
      :key="index"
      :class="{
        [tag]: true,
        'has-window-size': hasWindowSize,
      }"
    >
      <plugin-vessel
        v-for="(pluginContainer, innerIndex) of getSortedTo(tag)"
        :key="`${index}-${innerIndex}`"
        v-bind="{ pluginContainer }"
      />
    </div>
  </div>
</template>
```

- The `wrapper` div is the container element for the entire layout.
- Each plugin is positioned within the `plugin-vessel` component based on its `layoutTag`.

### 6.2 Summary of the Layout System

The `NineLayout` system provides a structured and flexible way to display plugins in one of nine defined positions within your map application. By using the `NineLayoutTag` enum and configuring it in `NineLayout.vue`, you can precisely control the placement of your plugins and customize them to fit the needs of your map application.

## Conclusion

Congratulations! You have now completed the Getting Started guide for POLAR. You should now have a solid understanding of how to set up and work with the POLAR package, integrate and configure plugins, and customize your map application to fit your project's needs.

### Next Steps

- Explore More Plugins: Experiment with different configurations.
- Develop Custom Plugins: Extend POLAR's capabilities.
- Contribute: Help improve the POLAR project.

Enjoy Building with POLAR! 🎉