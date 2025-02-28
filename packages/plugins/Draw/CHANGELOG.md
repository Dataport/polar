# CHANGELOG

## unpublished

- Feature: Add a `"translate"` mode that allows moving drawn features as they are.
- Feature: Add a `"snapTo"` key to the configuration that allows defining vector layers to snap to while drawing, editing, and translating.
- Feature: Add a lasso mode that allows copying up features from a vector layer that are contained within the user's hand drawn polygon. This also adds the fields `addLoading`, `removeLoading`, and `toastAction` for usage in the `lassos`.
- Feature: Interactions requiring dragging are now marked with the POLAR flag `_isPolarDragLikeInteraction`.
- Feature: An action `setInteractions` has been added to allow clients to bring their own geometry operations.
- Feature: Expose the `getSnaps` function. Intended to be used together with the `setInteractions` action only.
- Feature: Expose `Mode` type of Draw plugin for client-side extensions.

## 3.0.0

- Breaking: Upgrade peerDependency `ol` from `^9.2.4` to `^10.3.1`.
- Feature: Add new configuration parameter `measureOptions` to allow users to select a measurement mode when drawing a feature. This way, a length / area in the selected unit is added to the drawn feature.
- Fix: Update initial value of `drawMode` to a selectable value if the default `Point` is not a drawable option.
- Fix: Adjust type `DrawGetters` regarding its keys `selectableDrawModes` and `selectableModes` to correctly reflect that they represent objects.
- Fix: Stacked geometries can be separated with the "Edit" operation again. [Thanks to mike-000](https://github.com/openlayers/openlayers/issues/16593#issuecomment-2624257614).
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
