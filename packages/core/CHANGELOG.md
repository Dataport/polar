# CHANGELOG

## unpublished

- Feature: Add hovered and selected features to vuex store that support clustering. This is an optional functionality that has to be explicitly enabled and works with the `@masterportal/masterportalapi` default marker design. See configuration parameter `extendedMasterportalapiMarkers`.
- Feature: Add zoomLevel as plugin-agnostic map information to store.
- Feature: Change the `background-color` of all `v-tooltip`s to `#595959` and its `border` to `#fff` to be more visible. It now always has a contrast of 7, which is quite enough for AAA of WCAG.
- Feature: Add new state variable `hasSmallDisplay` which is updated on `resize` of the `window`.
- Chore: Add README information about listening to map client state and getters.

## 1.1.0

- Feature: Add core state variable for map's center position.

## 1.0.0

Initial release.
