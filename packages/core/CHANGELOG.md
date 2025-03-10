# CHANGELOG

## unpublished

- Feature: Add `singleTile` as as usable parameter in the configuration of WMS-layers.
- Feature: Additionally export `MapInstance` type.
- Fix: If a flag `_isPolarDragLikeInteraction` is present on any interaction, the page will stop scrolling in mobile mode, and the interaction takes precendence. Especially, this is done to prevent the tooltip on how to pan the map on mobile devices to appear. This flag is documented at the end of the README.md.

## 3.0.0

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.40.0` to `2.45.0` and subsequently `ol` from `^9.2.4` to `^10.3.1`.
- Feature: Add new reusable component `RadioCard.vue` to the package.
- Fix: Do not break themes of external Vuetify apps.
- Chore: Add documentation regarding icon override functionality.

## 2.0.1

- Fix: Add `crossOrigin` differently to layer sources that are an instance of `ImageWMS` as they require it being set as `crossOrigin_` to be recognized.
- Fix: Add missing `font-family` css so that tooltips are always `Arial, sans-serif`.

## 2.0.0

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.8.0` to `2.40.0` and subsequently `ol` from `^7.1.0` to `^9.2.4`.
- Breaking: Remove support for marking client CSS via `data-polar="true"`. Please use the configuration parameter `stylePath` instead.
- Feature: The `extendedMasterportalapiFeatures` feature has been extended by a `isSelectable` function and `unselectableStyle` to style markers accordingly.
- Feature: Add new state parameter `mapHasDimensions` to let plugins have a "hook" to react on when the map is ready.
- Feature: Add `deviceIsHorizontal` as a getter to have a more central place to check if the device is in landscape mode.
- Feature: Add clearer documentation regarding `@masterportal/masterportalapi` related configuration parameters including examples.
- Feature: Officially add support for WMTS layers.
- Feature: Add reasonable default values for configuration parameters `epsg`, `options`, `namedProjections` and `startResolution`.
- Feature: Add new configuration parameter `featureStyles` in conjunction with the parameter `styleId` on layer configurations to be able to style vector features.
- Feature: Officially add support for GeoJSON layers.
- Fix: Document `rawLayerList.initializeLayerList` as an essential step when creating a client.
- Fix: Move basic documentation of `layers` from `@polar/plugin-layer-chooser` to `@polar/core`.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Add package `events` as a dependency to fix issue with `xml2js`. See https://github.com/Leonidas-from-XIV/node-xml2js/issues/697 for more information.
- Fix: Adjust overlay to properly be displayed on macOS devices.
- Chore: Update dependencies to latest versions.

## 1.4.1

- Feature: Additionally export `PolarCore` type.
- Fix: The GFI's new flag `userInteraction` on the close interaction is forwarded. This is required for a fix in the GFI plugin.

## 1.4.0

- Feature: Add hatchable markers; that is, when using `extendedMasterportalapiMarkers`, marker fills can now contain patterns for better accessibility.
- Feature: Slightly enlarge `useExtendedMasterportalapiMarkers` markers for easier usage on mobile devices.
- Feature: Add possibility to change size of markers and clustered markers via `extendedMasterportalapiMarkers.MarkerStyle.size` and `extendedMasterportalapiMarkers.MarkerStyle.clusterSize`.
- Fix: Add missing deregistration of event listeners on destruction.

## 1.3.0

- Feature: Improved implementation to make core SPA-ready.
- Feature: A `renderFaToLightDom` parameter has been added. This can be used to disable rendering fontawesome styles to the Light/Root DOM. It is, by default, `true`.
- Feature: A `stylePath` property has been added to the MapConfiguration. This is the new way to import the client CSS; the previous way with `data-polar="true"` has been deprecated. See README for details.
- Feature: Add possibility to use the new slot added to `@polar/components` component `MoveHandle` to be able to use a different icon for the close-button.
- Feature: Add possibility to directly add the action button to the component `MoveHandle` via the new state variable `moveHandleActionButton`.
- Fix: POLAR now adds required Fontawesome styles to the Light/Root DOM. For more information, please check the `README.md` regarding `renderFaToLightDom`, which may also be used to disable this behaviour.
- Fix: Resolved an issue of the `selected` feature sometimes not properly resetting having previous features still being styled as selected.

## 1.2.1

- Fix dependency `@polar/components` version.

## 1.2.0

- Feature: Add hovered and selected features to vuex store that support clustering. This is an optional functionality that has to be explicitly enabled and works with the `@masterportal/masterportalapi` default marker design. See configuration parameter `extendedMasterportalapiMarkers`.
- Feature: Add zoomLevel as plugin-agnostic map information to store.
- Feature: Change the `background-color` of all `v-tooltip`s to `#595959` and its `border` to `#fff` to be more visible. It now always has a contrast of 7, which is quite enough for AAA of WCAG.
- Feature: Add new state variable `hasSmallDisplay` which is updated on `resize` of the `window`.
- Feature: Add possibility to add content of plugins to the now singleton MoveHandle.
- Chore: Add README information about listening to map client state and getters.

## 1.1.0

- Feature: Add core state variable for map's center position.

## 1.0.0

Initial release.
