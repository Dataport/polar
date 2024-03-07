# CHANGELOG

## 2.0.0-alpha.4

- Feature: Add `MoveHandle.vue` to this package.

## 2.0.0-alpha.3

- Fix: Model `olcs` as `peerDependency` to not break the build.

## 2.0.0-alpha.2

- Chore: Add correct versions for alpha testing.

## 2.0.0-alpha.1

- Breaking: As a result of the bundling with `rollup`, the styles of the package need to be imported via `@polar/core/styles.css`.
- Feature: The package is now being bundled by `rollup` before being published. This allows for a smaller package size and better compatibility with other packages.

## 1.4.1

- Feature: Additionally export `PolarCore` type.
- Fix: The GFI's new flag `userInteraction` on the close interaction is forwarded. This is required for a fix in the GFI plugin.

## 1.4.0

- Feature: Add hatchable markers; that is, when using `extendedMasterportalapiMarkers`, marker fills can now contain patterns for better accessibility.
- Feature: Slightly enlarge `useExtendedMasterportalapiMarkers` markers for easier usage on mobile devices.
- Feature: Add possibility to change size of markers and clustered markers via `extendedMasterportalapiMarkers.MarkerStyle.size` and `extendedMasterportalapiMarkers.MarkerStyle.clusterSize`.
- Fix: Add missing deregistration of event listeners on destruction.

## 1.3.0

- Feature: Improved implementation to make core SPA-ready.
- Feature: A `renderFaToLightDom` parameter has been added. This can be used to disable rendering fontawesome styles to the Light/Root DOM. It is, by default, `true`.
- Feature: A `stylePath` property has been added to the MapConfiguration. This is the new way to import the client CSS; the previous way with `data-polar="true"` has been deprecated. See README for details.
- Feature: Add possibility to use the new slot added to `@polar/components` component `MoveHandle` to be able to use a different icon for the close-button.
- Feature: Add possibility to directly add the action button to the component `MoveHandle` via the new state variable `moveHandleActionButton`.
- Fix: POLAR now adds required Fontawesome styles to the Light/Root DOM. For more information, please check the `README.md` regarding `renderFaToLightDom`, which may also be used to disable this behaviour.
- Fix: Resolved an issue of the `selected` feature sometimes not properly resetting having previous features still being styled as selected.

## 1.2.1

- Fix dependency `@polar/components` version.

## 1.2.0

- Feature: Add hovered and selected features to vuex store that support clustering. This is an optional functionality that has to be explicitly enabled and works with the `@masterportal/masterportalapi` default marker design. See configuration parameter `extendedMasterportalapiMarkers`.
- Feature: Add zoomLevel as plugin-agnostic map information to store.
- Feature: Change the `background-color` of all `v-tooltip`s to `#595959` and its `border` to `#fff` to be more visible. It now always has a contrast of 7, which is quite enough for AAA of WCAG.
- Feature: Add new state variable `hasSmallDisplay` which is updated on `resize` of the `window`.
- Feature: Add possibility to add content of plugins to the now singleton MoveHandle.
- Chore: Add README information about listening to map client state and getters.

## 1.1.0

- Feature: Add core state variable for map's center position.

## 1.0.0

Initial release.
