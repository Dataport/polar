# CHANGELOG

## 2.2.0

- Feature: Change configuration of `layer.type` to be set to `background` or any other String. All layers that have their `type` not set to `background` are considered "overlays". For the type `mask` locales are already implemented. For any additional type, these have to be added separately.
- Feature: Add new exported type `DisabledLayers` describing an object structure mapping layerIds to whether the respective layer is disabled or not.
- Fix: Layer options layer names are now translated if they're locale keys.
- Fix: Resolve an issue of loosing visible focus when using the keyboard to open or close the layer options menu.

## 2.1.0

- Feature: Add new configuration parameter `component` to be able to interchange the UI component of this plugin.
- Feature: Expose `Options.vue` as new export `LayerChooserOptions` in order to use it in custom implementations.
- Feature: Expose `LayerWrapper.vue` as new export `LayerChooserLayerWrapper` in order to use it in custom implementations.
- Fix: Resolve a bug where keyboard navigation in radio groups didn't work.
- Chore: The documentation for `minZoom` and `maxZoom` has been updated regarding their inclusive interpretation of the zoom value.

## 2.0.0

- Breaking: Upgrade `@masterportal/masterportalapi` from `2.40.0` to `2.45.0` and subsequently `ol` from `^9.2.4` to `^10.3.1`.
- Fix: Use plural for german description of the localization key `plugins.layerChooser.backgroundTitle`.

## 1.2.1

- Fix: Move relevant documentation of `layers` to `@polar/core`.
- Fix: The LayerChooser plugin will keep working on the error that a layer without entry in the service register has been configured. The layer will not be displayed.
- Fix: An outdated warning has been removed.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Some type issues have been resolved.
- Fix: Add missing peerDependencies `@masterportal/masterportalapi@2.40.0` and `ol@^9.2.4`.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.

## 1.0.0

Initial release.
