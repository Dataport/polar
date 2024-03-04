# CHANGELOG

## unpublished

- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.
- BREAKING: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/plugin-pins/styles.css`.

## 1.3.0

- Feature: Pins can now be re-initialized with the `setupInitial` action. This is an advanced feature currently only available when coding clients.

## 1.2.0

- Feature: Improved implementation to make plugin SPA-ready.
- Fix: Pins are no longer set while there is a `Modify` interaction or one with flag `_isDeleteSelect`. This missing previously led to pin reset on draw interactions.

## 1.1.1

- Fix: Add missing repository information in package.json.

## 1.1.0

- Deprecated: Using `movable` with a `boolean` has been deprecated. Please use the parameter with a string. For more information, see the documentation of the package.
- Feature: Update `@polar/lib-passes-boundary-check` to major version 2.
- Feature: Add `boundaryOnError` parameter to let user define behaviour on boundary check errors.
- Feature: Add new configuration parameter `initial` to be able to add a pin initially to the map.
- Feature: If `movable` is set to `none` or `false`, the style of the cursor is set to `not-allowed` when hovering the pin.
- Fix: Mouse cursor wasn't `'grab'` from second created pin on. It now is on all movable pins.
- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
