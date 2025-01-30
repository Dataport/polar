# CHANGELOG

## unpublished

- Breaking: Upgrade peerDependency `ol` from `^9.2.4` to `^10.3.1`.

## 2.0.0

- Breaking: Upgrade peerDependency `ol` from `^7.1.0` to `^9.2.4`.
- Breaking: Remove support of configuring `movable` with a `boolean`. Please see the documentation for more information on how to configure this parameter.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Chore: Refactor parts of the data handling.

## 1.3.1

- Fix: The map dragged along with the pin in some situations, rendering the pin effectively immovable. This has been fixed.

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
