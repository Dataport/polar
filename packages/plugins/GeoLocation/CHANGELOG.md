# CHANGELOG

## unpublished

- Feature: Position is now tracked when user is outside of the boundary layer but inside the map extent.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Fix: Add missing peerDependency `ol@^9.2.4`.

## 1.3.1

- Fix: Only zoom to the user position if the user is currently in the extent of the map. The user position is no longer indicated when it's outside the map's extent.
- Fix: The plugin would fail the map initialization procedure on Safari 15 and prior. This issue has been resolved by disabling the fail-fast feature for browsers not supporting `navigator.permissions.query`.

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
