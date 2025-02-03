# CHANGELOG

## unpublished

- Breaking: Upgrade peerDependency `ol` from `^9.2.4` to `^10.3.1`.
- Feature: Add new configuration parameter `measureOptions` to allow users to select a measurement mode when drawing a feature. This way, a length / area in the selected unit is added to the drawn feature.
- Fix: Update initial value of `drawMode` to a selectable value if the default `Point` is not a drawable option.
- Fix: Adjust type `DrawGetters` regarding its keys `selectableDrawModes` and `selectableModes` to correctly reflect that they represent objects.
- Chore: Add `@polar/core` as a dependency as the component `RadioCard.vue` has been moved from this package to `@polar/core`.

## 2.0.0

- Breaking: Upgrade peerDependency `ol` from `^7.1.0` to `^9.2.4`.
- Fix: Adjust documentation to properly describe optionality of configuration parameters.
- Feature: Make the stroke color for drawn geometry features selectable and editable.

## 1.1.0

- Feature: Improved implementation to make plugin SPA-ready.

## 1.0.1

- Fix: Documentation error regarding plugin state.

## 1.0.0

Initial release.
