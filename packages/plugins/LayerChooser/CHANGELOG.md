# CHANGELOG

## unpublished

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
