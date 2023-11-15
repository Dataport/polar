# CHANGELOG

## 1.1.0

- Deprecated: Using `movable` with a `boolean` has been deprecated. Please use the parameter with a string. For more information, see the documentation of the package.
- Feature: Update `@polar/lib-passes-boundary-check` to major version 2.
- Feature: Add `boundaryOnError` parameter to let user define behaviour on boundary check errors.
- Feature: Add new configuration parameter `initial` to be able to add a pin initially to the map.
- Feature: If `movable` is set to `none` or `false`, the style of the cursor is set to `not-allowed` when hovering the pin.
- Fix: Mouse cursor wasn't `'grab'` from second created pin on. It now is on all movable pins.

## 1.0.0

Initial release.
