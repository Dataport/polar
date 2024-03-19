# CHANGELOG

## unpublished

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-geo-location/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.3.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.2.0

- Feature: Add parameter `renderType` to configuration, allowing configuration as IconMenu subcomponent.
- Feature: Hide obstructive tooltip on small devices.
- Fix: Documentation error regarding plugin state.

## 1.1.0

- Feature: Update`@polar/lib-passes-boundary-check` to major version 2.
- Feature: Add `boundaryOnError` parameter to let user define behaviour on boundary check errors.
- Feature: Add optional tooltip to user geolocation map icon.

## 1.0.0

Initial release.
