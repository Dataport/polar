# CHANGELOG

## unpublished

- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- BREAKING: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-layer-chooser/styles.css`.
- Fix: The LayerChooser plugin will keep working on the error that a layer without entry in the service register has been configured. The layer will not be displayed.
- Fix: An outdated warning has been removed.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.1.0

- Feature: Hide obstructive tooltip on small devices.

## 1.0.0

Initial release.
